"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FlattenedApplication,
  TableColumnTy,
  UsersTableTempProps,
} from "@/types";
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
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Select,
  SelectItem,
  Link,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "./plusIcon";
import { VerticalDotsIcon } from "./verticalDotsIcon";
import { ChevronDownIcon } from "./chevronDownIcon";
import { SearchIcon } from "./searchIcon";
import { capitalize } from "./utils";
import { formatDate } from "@/utils/formatDate";
import { useLanguage } from "@/utils/languageContext";
import { AuthRequiredError, DataFetchFailedError } from "@/lib/exceptions";

export default function UsersTableTemp({
  applications,
  onRemoveApplication,
  onIssueCertificate,
  onRejectCertificate,
}: UsersTableTempProps) {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = session?.user.token;

  const { translations } = useLanguage();
  const [columns, setColumns] = useState<TableColumnTy[]>([
    {
      name: `${translations.strings.event}`,
      uid: "eventTitle",
      sortable: true,
    },
    {
      name: `${translations.strings.firstName}`,
      uid: "firstName",
      sortable: true,
    },
    // { name: "Description", uid: "description", sortable: true },
    {
      name: `${translations.strings.lastName}`,
      uid: "lastName",
      sortable: true,
    },
    {
      name: `${translations.strings.location}`,
      uid: "address",
      sortable: true,
    },
    {
      name: `${translations.strings.phoneNumber}`,
      uid: "phoneNumber",
      sortable: true,
    },
    { name: `${translations.strings.email}`, uid: "email", sortable: true },
    {
      name: `${translations.strings.appCreatedAt}`,
      uid: "createdAt",
      sortable: true,
    },
    {
      name: `${translations.strings.spokenLanguage}`,
      uid: "spokenLanguage",
      sortable: true,
    },
    {
      name: `${translations.strings.writtenLanguage}`,
      uid: "writtenLanguage",
      sortable: true,
    },
    {
      name: `${translations.strings.totalWorkingHours}`,
      uid: "totalWorkingHours",
      sortable: true,
    },
    {
      name: `${translations.strings.totalUnissuedHours}`,
      uid: "totalUnissuedHours",
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
      sortable: false,
    },
  ]);

  useEffect(() => {
    setColumns([
      {
        name: `${translations.strings.event}`,
        uid: "eventTitle",
        sortable: true,
      },
      {
        name: `${translations.strings.firstName}`,
        uid: "firstName",
        sortable: true,
      },
      // { name: "Description", uid: "description", sortable: true },
      {
        name: `${translations.strings.lastName}`,
        uid: "lastName",
        sortable: true,
      },
      {
        name: `${translations.strings.location}`,
        uid: "address",
        sortable: true,
      },
      {
        name: `${translations.strings.phoneNumber}`,
        uid: "phoneNumber",
        sortable: true,
      },
      { name: `${translations.strings.email}`, uid: "email", sortable: true },
      {
        name: `${translations.strings.appCreatedAt}`,
        uid: "createdAt",
        sortable: true,
      },
      {
        name: `${translations.strings.spokenLanguage}`,
        uid: "spokenLanguage",
        sortable: true,
      },
      {
        name: `${translations.strings.writtenLanguage}`,
        uid: "writtenLanguage",
        sortable: true,
      },
      {
        name: `${translations.strings.totalWorkingHours}`,
        uid: "totalWorkingHours",
        sortable: true,
      },
      {
        name: `${translations.strings.totalUnissuedHours}`,
        uid: "totalUnissuedHours",
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
        sortable: false,
      },
    ]);
  }, [translations]);

  const statusOptions = [
    { name: `${translations.strings.verified}`, uid: "verified" },
    { name: `${translations.strings.pending}`, uid: "pending" },
    { name: `${translations.strings.rejected}`, uid: "rejected" },
    // { name: "Not Submitted", uid: "notSubmitted" },
    // { name: "Submitted", uid: "submitted" },
    // { name: "Approved", uid: "approved" },
    // { name: "Rejected", uid: "rejected" },
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
    "firstName",
    "lastName",
    "address",
    "phoneNumber",
    "email",
    "createdAt",
    "spokenLanguage",
    "writtenLanguage",
    "totalWorkingHours",
    "totalUnissuedHours",
    "status",
    "certificateStatus",
    "actions",
  ];

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
  const [currentEventId, setCurrentEventId] = useState<string>("");
  const [currentUniqueId, setCurrentUniqueId] = useState<string>("");

  useEffect(() => {
    const idsAreUnique =
      new Set(applications.map((app) => app.eventUniqueId)).size ===
      applications.length;
    console.assert(idsAreUnique, "IDs are not unique", applications);
  }, [applications]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [columns, visibleColumns, translations]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...applications];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.firstName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [applications, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortDescriptor.column === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        const cmp = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      } else {
        const first = a[sortDescriptor.column as keyof FlattenedApplication];
        const second = b[sortDescriptor.column as keyof FlattenedApplication];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    });
  }, [sortDescriptor, items]);

  const handleDeleteEvent = async (eventId: string, eventObjectId: string) => {
    if (!session) {
      throw new AuthRequiredError();
    }
    console.log(eventId, eventObjectId);

    try {
      const response = await fetch(
        `http://localhost:8500/application/delete/${eventId}/${eventObjectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the application event");
      }

      onRemoveApplication(eventObjectId);
      onClose();
    } catch (error) {
      console.error("Error deleting application event:", error);
    }
  };

  function getDropdownItems(application: FlattenedApplication) {
    // Always include these items
    const items = [];

    // Add additional items for admin users
    if (session && session.user.role === "admin") {
      items.push(
        <DropdownItem key="edit" textValue="edit">
          <Link
            className="w-full flex flex-row justify-center text-sm text-foreground"
            href={`/applications/${application.eventId}/${application.eventUniqueId}/edit`}
          >
            Edit
          </Link>
        </DropdownItem>,
        <DropdownItem
          key="issueCertificate"
          className="text-center text-sm text-foreground"
          textValue="issue"
          onClick={() =>
            onIssueCertificate(application.eventId, application.userId, token)
          }
        >
          Issue Certificate
        </DropdownItem>,
        <DropdownItem
          key="rejectCertificate"
          className="text-center text-sm text-foreground"
          textValue="reject"
          onClick={() =>
            onRejectCertificate(application.eventId, application.userId, token)
          }
        >
          Reject Certificate
        </DropdownItem>,
        <DropdownItem
          key="delete"
          color="danger"
          className="text-center text-sm text-foreground"
          textValue="delete"
          onClick={() => {
            setCurrentEventId(application.eventId);
            setCurrentUniqueId(application.eventUniqueId);
            onOpen();
          }}
        >
          Delete
        </DropdownItem>
      );
    }

    return items;
  }

  const renderCell = React.useCallback(
    (application: FlattenedApplication, columnKey: React.Key) => {
      const cellValue = application[columnKey as keyof FlattenedApplication];

      switch (columnKey) {
        case "eventTitle":
          return <p>{application.eventTitle}</p>;
        case "firstName":
          return <p>{application.firstName}</p>;
        case "lastName":
          return <div className="flex flex-col">{application.lastName}</div>;
        case "address":
          return <div className="flex flex-col">{application.address}</div>;
        case "phoneNumber":
          return <div className="flex flex-col">{application.phoneNumber}</div>;
        case "email":
          return <div className="flex flex-col">{application.email}</div>;
        case "createdAt":
          return (
            <div className="flex flex-col">
              {formatDate(application.createdAt)}
            </div>
          );
        case "totalUnissuedHours":
          return (
            <div className="flex flex-col">
              {application.totalUnissuedHours}
            </div>
          );
        case "totalWorkingHours":
          return (
            <div className="flex flex-col">{application.totalWorkingHours}</div>
          );
        case "certificateStatus":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[application.certificateStatus]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[application.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
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
                <DropdownMenu aria-label="Action Items" items={applications}>
                  {getDropdownItems(application)}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [session, applications]
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
            {/* {session && session.user.role === "admin" && (
              <Button
                as={"a"}
                href="/add-application"
                color="primary"
                endContent={<PlusIcon />}
              >
                Add New
              </Button>
            )} */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {translations.strings.total} {applications.length}{" "}
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
    applications.length,
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
    <>
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
        <TableBody emptyContent={"No applications found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.eventUniqueId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{translations.strings.delConfirm}</ModalHeader>
          <ModalBody>{translations.strings.delConfirmQueApp}</ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={() => handleDeleteEvent(currentEventId, currentUniqueId)}
            >
              {translations.strings.delete}
            </Button>
            <Button onClick={onClose}>{translations.strings.cancel}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
