"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Event, TableColumnTy } from "@/types";
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
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ChevronDownIcon } from "./chevronDownIcon";
import { SearchIcon } from "./searchIcon";
import { capitalize } from "./utils";
import { getEvents } from "@/lib/getEvents";
import { formatDate } from "@/utils/formatDate";
import { useLanguage } from "@/utils/languageContext";
import { AuthRequiredError, DataFetchFailedError } from "@/lib/exceptions";

export default function TableTemp() {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { translations } = useLanguage();
  const [columns, setColumns] = useState<TableColumnTy[]>([
    { name: `${translations.strings.event}`, uid: "title", sortable: true },
    {
      name: `${translations.strings.location}`,
      uid: "location",
      sortable: true,
    },
    {
      name: `${translations.strings.releaseDate}`,
      uid: "releaseDate",
      sortable: true,
    },
    {
      name: `${translations.strings.startDate}`,
      uid: "startDate",
      sortable: true,
    },
    {
      name: `${translations.strings.deadline}`,
      uid: "deadline",
      sortable: true,
    },
    {
      name: `${translations.strings.applicationCount}`,
      uid: "applicationCount",
      sortable: true,
    },
    {
      name: `${translations.strings.totalWorkingHours}`,
      uid: "totalWorkingHours",
      sortable: true,
    },
    { name: `${translations.strings.status}`, uid: "status", sortable: true },
    {
      name: `${translations.strings.actions}`,
      uid: "actions",
      sortable: false,
    },
  ]);

  useEffect(() => {
    setColumns([
      { name: `${translations.strings.event}`, uid: "title", sortable: true },
      {
        name: `${translations.strings.location}`,
        uid: "location",
        sortable: true,
      },
      {
        name: `${translations.strings.releaseDate}`,
        uid: "releaseDate",
        sortable: true,
      },
      {
        name: `${translations.strings.startDate}`,
        uid: "startDate",
        sortable: true,
      },
      {
        name: `${translations.strings.deadline}`,
        uid: "deadline",
        sortable: true,
      },
      {
        name: `${translations.strings.applicationCount}`,
        uid: "applicationCount",
        sortable: true,
      },
      {
        name: `${translations.strings.totalWorkingHours}`,
        uid: "totalWorkingHours",
        sortable: true,
      },
      { name: `${translations.strings.status}`, uid: "status", sortable: true },
      {
        name: `${translations.strings.actions}`,
        uid: "actions",
        sortable: false,
      },
    ]);
  }, [translations]);

  const statusOptions = [
    { name: `${translations.strings.active}`, uid: "active" },
    { name: `${translations.strings.paused}`, uid: "paused" },
    { name: `${translations.strings.closedStatus}`, uid: "closed" },
    // Add other statuses as needed
  ];

  const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "warning",
    closed: "danger",
  };

  const INITIAL_VISIBLE_COLUMNS = [
    "title",
    // "description",
    "location",
    "releaseDate",
    "startDate",
    "deadline",
    "applicationCount",
    "totalWorkingHours",
    "status",
    "actions",
  ];

  // const [error, setError] = useState("");

  const [events, setEvents] = useState<Event[]>([]);
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
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData || []); // Ensure the fallback to an empty array
      } catch (error) {
        // setError("error");
      }
    }
    fetchData();
  }, []);

  // if (error) {
  //   throw new DataFetchFailedError();
  // }

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [columns, visibleColumns, translations]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...events];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.title.toLowerCase().includes(filterValue.toLowerCase())
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
  }, [events, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortDescriptor.column === "releaseDate") {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        const cmp = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      } else {
        const first = a[sortDescriptor.column as keyof Event];
        const second = b[sortDescriptor.column as keyof Event];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    });
  }, [sortDescriptor, items]);

  const handleDeleteEvent = async () => {
    if (!session) {
      throw new AuthRequiredError();
    }
    try {
      const response = await fetch(
        `https://ocn-data.vercel.app/events/delete/${currentEventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
      const updatedEvents = events.filter(
        (event) => event._id !== currentEventId
      );
      setEvents(updatedEvents);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  function getDropdownItems(event: Event) {
    // Always include these items
    const items = [
      <DropdownItem
        className="text-center"
        key="view"
        textValue={translations.strings.view}
      >
        <Link
          className="w-full flex flex-row justify-center text-sm text-foreground"
          href={`/events/${event._id}`}
        >
          <p>{translations.strings.view}</p>
        </Link>
      </DropdownItem>,
      // <DropdownItem key="apply" as="a" href={`/event/${event._id}`}>
      //   Apply
      // </DropdownItem>,
    ];

    // Add additional items for admin users
    if (session && session.user.role === "admin") {
      items.push(
        <DropdownItem
          className="text-center"
          key="edit"
          textValue={translations.strings.edit}
        >
          <Link
            className="w-full flex flex-row justify-center text-sm text-foreground"
            as="a"
            href={`/events/${event._id}/edit`}
          >
            {translations.strings.edit}
          </Link>
        </DropdownItem>,
        <DropdownItem
          className="text-center"
          key="delete"
          color="danger"
          textValue={translations.strings.delete}
          onClick={() => {
            setCurrentEventId(event._id);
            onOpen();
          }}
        >
          {translations.strings.delete}
        </DropdownItem>
      );
    }

    return items;
  }

  const renderCell = React.useCallback(
    (event: Event, columnKey: React.Key) => {
      const cellValue = event[columnKey as keyof Event];

      switch (columnKey) {
        case "title":
          return <p>{event.title}</p>;
        case "releaseDate":
          return (
            <div className="flex flex-col">{formatDate(event.releaseDate)}</div>
          );
        case "startDate":
          return (
            <div className="flex flex-col">{formatDate(event.startDate)}</div>
          );
        case "deadline":
          return (
            <div className="flex flex-col">{formatDate(event.deadline)}</div>
          );
        case "applicationCount":
          // Render the applicationCount with a Link
          return (
            <>
              {session && session.user.role === "admin" ? (
                <Link href={`/applications/${event._id}`} color="primary">
                  {cellValue.toString()}
                </Link>
              ) : (
                <div>{cellValue.toString()}</div>
              )}
            </>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[event.status]}
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
                <DropdownMenu aria-label="Action Items" items={events}>
                  {getDropdownItems(event)}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [session, events, translations]
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
            {session && session.user.role === "admin" && (
              <Button endContent={<PlusIcon />}>
                <Link className="text-foreground" as={"a"} href="/add-event">
                  {translations.strings.addNew}
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {translations.strings.total} {events.length}{" "}
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
    events.length,
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
        <TableBody emptyContent={"No events found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
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
          <ModalBody>{translations.strings.delConfirmQue}</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteEvent}>
              {translations.strings.delete}
            </Button>
            <Button onClick={onClose}>{translations.strings.cancel}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
