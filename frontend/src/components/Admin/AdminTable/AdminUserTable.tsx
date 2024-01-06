import {
  Button,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserData, usersData } from "../../../pages/AdminPage/AdminPage";
import React from "react";
import styles from "../tableStyles.module.css";
import classNames from "classnames";
import { DeleteIcon, EditIcon, UpDownIcon, ViewIcon } from "@chakra-ui/icons";

import Pagination from "../../Pagination/Pagination";
import Filter from "./Filter";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
];

function AdminUserTable() {
  const [data, setData] = React.useState(usersData);
  const [columnFilters, setColumnFilters] = React.useState<
    { id: string; value: string }[]
  >([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const updateData = async (rowId: number, value: Omit<UserData, "id">) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { id: row.id, ...value } : row))
    );
  };

  const handleRowEdit = (row: UserData) => {
    updateData(row.id, {
      first_name: "Gleb",
      last_name: "Glebov",
      username: "Glebasik",
      email: "Gleb@gmail.com",
    });
  };

  return (
    <>
      <Filter columnFilters = {columnFilters} setColumnFilters={setColumnFilters}/>
      <TableContainer minHeight="70vh" mb={4}>
        <Table w={"100%"}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    className={classNames(styles.table_header)}
                    key={header.id}
                    w={header.getSize()}
                  >
                    {header.column.columnDef.header?.toString()}
                    {header.column.getCanSort() && (
                      <UpDownIcon
                        ml={2}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      />
                    )}
                  </Th>
                ))}
                <Th className={classNames(styles.table_header)} w={24}>
                  <Button
                    _hover={{ background: "#3ABF2B" }}
                    bg="#34C924"
                    color="white"
                    size="sm"
                  >
                    Add new user
                  </Button>
                </Th>
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    w={cell.column.getSize()}
                    className="page-text page-reg-text"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
                <Td w={24}>
                  <IconButton
                    aria-label="See more"
                    bg={"transparent"}
                    icon={<ViewIcon color={"#a2d2ff"} />}
                    onClick={() => {
                      handleRowEdit(row.original);
                    }}
                  />
                  <IconButton
                    aria-label="Edit row"
                    bg={"transparent"}
                    icon={<EditIcon />}
                    onClick={() => {
                      handleRowEdit(row.original);
                    }}
                  />
                  <IconButton
                    aria-label="Delete row"
                    bg={"transparent"}
                    icon={<DeleteIcon color={"#E32636"} />}
                    onClick={() => {
                      handleRowEdit(row.original);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        onNextPageClick={() => table.nextPage()}
        onPrevPageClick={() => table.previousPage()}
        disable={{
          left: !table.getCanPreviousPage(),
          right: !table.getCanNextPage(),
        }}
        nav={{
          current: table.getState().pagination.pageIndex + 1,
          total: table.getPageCount(),
        }}
      />
    </>
  );
}

export default AdminUserTable;
