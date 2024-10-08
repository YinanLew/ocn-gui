"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  Select,
  SelectItem,
  Chip,
  ChipProps,
  Link,
} from "@nextui-org/react";
import {
  AppsTableExtendedProps,
  EventWorkingHours,
  TableColumnTy,
} from "@/types";
import { VerticalDotsIcon } from "./verticalDotsIcon";
import { ChevronDownIcon } from "./chevronDownIcon";
import { SearchIcon } from "./searchIcon";
import { capitalize } from "./utils";
import { useSession } from "next-auth/react";
import { formatDate } from "@/utils/formatDate";
import { useLanguage } from "@/utils/languageContext";

export default function AppsTable({ apps, fetchData }: AppsTableExtendedProps) {
  const { data: session, status } = useSession();
  const { translations } = useLanguage();

  const [columns, setColumns] = useState<TableColumnTy[]>([
    {
      name: `${translations.strings.event}`,
      uid: "eventTitle",
      sortable: true,
    },
    {
      name: `${translations.strings.totalWorkingHours}`,
      uid: "totalHours",
      sortable: true,
    },
    {
      name: `${translations.strings.totalUnissuedHours}`,
      uid: "totalUnissuedHours",
      sortable: true,
    },
    {
      name: `${translations.strings.appCreatedAt}`,
      uid: "appCreatedAt",
      sortable: true,
    },
    { name: `${translations.strings.status}`, uid: "status", sortable: true },
    {
      name: `${translations.strings.certificateStatus}`,
      uid: "certificateStatus",
      sortable: true,
    },
    { name: `${translations.strings.actions}`, uid: "actions", sortable: true },
  ]);

  useEffect(() => {
    setColumns([
      {
        name: `${translations.strings.event}`,
        uid: "eventTitle",
        sortable: true,
      },
      {
        name: `${translations.strings.totalWorkingHours}`,
        uid: "totalHours",
        sortable: true,
      },
      {
        name: `${translations.strings.totalUnissuedHours}`,
        uid: "totalUnissuedHours",
        sortable: true,
      },
      {
        name: `${translations.strings.appCreatedAt}`,
        uid: "appCreatedAt",
        sortable: true,
      },
      { name: `${translations.strings.status}`, uid: "status", sortable: true },
      {
        name: `${translations.strings.certificateStatus}`,
        uid: "certificateStatus",
        sortable: true,
      },
      {
        name: `${translations.strings.actions}`,
        uid: "actions",
        sortable: true,
      },
    ]);
  }, [translations]);

  const statusOptions = [
    { name: `${translations.strings.verified}`, uid: "verified" },
    { name: `${translations.strings.pending}`, uid: "pending" },
    { name: `${translations.strings.rejected}`, uid: "rejected" },
    { name: `${translations.strings.notSubmitted}`, uid: "notSubmitted" },
    { name: `${translations.strings.submitted}`, uid: "submitted" },
    { name: `${translations.strings.approved}`, uid: "approved" },
    // { name: `${translations.strings.rejected}`, uid: "rejected" },
    // Add other statuses as needed
  ];

  const statusColorMap: Record<string, ChipProps["color"]> = {
    verified: "success",
    pending: "warning",
    rejected: "danger",
    notSubmitted: "default",
    submitted: "warning",
    approved: "success",
  };

  const INITIAL_VISIBLE_COLUMNS = [
    "eventTitle",
    "totalHours",
    "totalUnissuedHours",
    "appCreatedAt",
    "status",
    "certificateStatus",
    "actions",
  ];
  const token = session?.user.token;
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "releaseDate",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [columns, visibleColumns, translations]);

  const filteredItems = React.useMemo(() => {
    let filteredApps = [...apps];

    if (hasSearchFilter) {
      filteredApps = filteredApps.filter((app) =>
        app.eventTitle.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredApps = filteredApps.filter((app) =>
        Array.from(statusFilter).includes(app.status)
      );
    }

    return filteredApps;
  }, [apps, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortDescriptor.column === "appCreatedAt") {
        const dateA = new Date(a.appCreatedAt).getTime();
        const dateB = new Date(b.appCreatedAt).getTime();
        const cmp = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      } else {
        const first = a[sortDescriptor.column as keyof EventWorkingHours];
        const second = b[sortDescriptor.column as keyof EventWorkingHours];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    });
  }, [sortDescriptor, items]);

  // In AppsTable component

  const submitCertificateApplication = async (
    eventId: string,
    token: string | undefined
  ) => {
    if (token) {
      try {
        const response = await fetch(
          `https://ocn-data.onrender.com/working-hours/submit-certificate/${eventId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert("Certificate application submitted successfully.");
          fetchData();
        } else {
          const error = await response.json();
          alert(`Error submitting certificate application: ${error.message}`);
        }
      } catch (error) {
        console.error("Failed to submit certificate application:", error);
        alert("Error submitting certificate application. Please try again.");
      }
    }
  };

  function getDropdownItems(app: EventWorkingHours) {
    const items = [];

    if (app.status === "verified") {
      items.push(
        <DropdownItem
          className="text-center"
          key="submit"
          textValue="submitHours"
        >
          <Link
            className="w-full flex flex-row justify-center text-sm text-foreground"
            href={`/my-applications/${app._id}`}
          >
            Submit Hours
          </Link>
        </DropdownItem>,
        <DropdownItem
          className="text-center"
          key="apply"
          textValue="certificateApply"
          onClick={() => submitCertificateApplication(app._id, token)}
        >
          Apply for Certificate
        </DropdownItem>
      );
    } else {
      items.push(
        <DropdownItem className="text-center" key="pending">
          Under Consideration
        </DropdownItem>
      );
    }
    return items;
  }

  const renderCell = React.useCallback(
    (app: EventWorkingHours, columnKey: React.Key) => {
      const cellValue = app[columnKey as keyof EventWorkingHours];

      switch (columnKey) {
        case "eventTitle":
          return <p>{app.eventTitle}</p>;
        case "totalUnissuedHours":
          return <div className="flex flex-col">{app.totalUnissuedHours}</div>;
        case "appCreatedAt":
          return (
            <div className="flex flex-col">{formatDate(app.appCreatedAt)}</div>
          );

        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[app.status]}
              size="sm"
              variant="flat"
            >
              {app.status}
            </Chip>
          );
        case "certificateStatus":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[app.certificateStatus]}
              size="sm"
              variant="flat"
            >
              {app.certificateStatus}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    aria-label="Actions"
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Action Items" items={apps}>
                  {getDropdownItems(app)}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [session, apps]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    const dropdownColumns = columns;
    // session && session.user.role === "admin"
    //   ? columns
    //   : columns.filter((column) => column.name !== "Actions");
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={translations.strings.search}
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {translations.strings.status}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {translations.strings.columns}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {dropdownColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {translations.strings.total} {apps.length}{" "}
            {translations.strings.event}
          </span>
          <Select
            label={translations.strings.rpp}
            className="w-36 sm:max-w-xs"
            onChange={onRowsPerPageChange}
          >
            <SelectItem key="5" value="5">
              5
            </SelectItem>
            <SelectItem key="10" value="10">
              10
            </SelectItem>
            <SelectItem key="15" value="15">
              15
            </SelectItem>
          </Select>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    apps.length,
    hasSearchFilter,
    session,
    columns,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {/* {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`} */}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            {translations.strings.previous}
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            {translations.strings.next}
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter, columns]);

  if (status === "loading") {
    return <div>Loading...</div>; // or any other loading indicator
  }

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px] sm:max-h-full w-full",
      }}
      selectedKeys={selectedKeys}
      // selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            className="text-center"
            key={column.uid}
            align={"center"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No apps found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
