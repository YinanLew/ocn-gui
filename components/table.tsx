"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Event } from "@/types";
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
} from "@nextui-org/react";
import { PlusIcon } from "./plusIcon";
import { VerticalDotsIcon } from "./verticalDotsIcon";
import { ChevronDownIcon } from "./chevronDownIcon";
import { SearchIcon } from "./searchIcon";
import { capitalize } from "./utils";
import { getEvents } from "@/lib/getEvents";
import { formatDate } from "@/utils/formatDate";

const columns = [
  { name: "Event", uid: "title", sortable: true },
  // { name: "Description", uid: "description", sortable: true },
  { name: "Location", uid: "location", sortable: true },
  { name: "Release Date", uid: "releaseDate", sortable: true },
  { name: "Start Date", uid: "startDate", sortable: true },
  { name: "Deadline", uid: "deadline", sortable: true },
  { name: "Applications", uid: "applicationCount", sortable: true },
  { name: "Total Hours", uid: "totalWorkingHours", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Closed", uid: "closed" },
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

export default function TableTemp() {
  const { data: session, status } = useSession();

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

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData || []); // Ensure the fallback to an empty array
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchData();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

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

  const handleDeleteEvent = async (eventId: string) => {
    if (!session) {
      console.error("No session found");
      // Handle the case when there is no session (e.g., redirect to login)
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8500/events/delete/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`, // Include the JWT token in the Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  function getDropdownItems(event: Event) {
    // Always include these items
    const items = [
      <DropdownItem key="view" as="a" href={`/events/${event._id}`}>
        View
      </DropdownItem>,
      // <DropdownItem key="apply" as="a" href={`/event/${event._id}`}>
      //   Apply
      // </DropdownItem>,
    ];

    // Add additional items for admin users
    if (session && session.user.role === "admin") {
      items.push(
        <DropdownItem key="edit" as="a" href={`/events/${event._id}/edit`}>
          Edit
        </DropdownItem>,
        <DropdownItem key="delete" onClick={() => handleDeleteEvent(event._id)}>
          Delete
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
    [session, events]
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
    const dropdownColumns =
      session && session.user.role === "admin"
        ? columns
        : columns.filter((column) => column.name !== "Actions");
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
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
                  Status
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
                  Columns
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
              <Button
                as={"a"}
                href="/add-event"
                color="primary"
                endContent={<PlusIcon />}
              >
                Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {events.length} events
          </span>
          <Select
            label="Rows per page:"
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
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
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
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

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
  );
}
