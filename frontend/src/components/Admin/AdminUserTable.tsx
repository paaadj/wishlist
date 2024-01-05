import {
  Box,
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
  useReactTable,
} from "@tanstack/react-table";
import { UserData, usersData } from "../../pages/AdminPage/AdminPage";
import React from "react";
import styles from "./tableStyles.module.css";
import classNames from "classnames";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    <TableContainer>
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
                  {/* <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={classNames(styles.resizer, {
                    [styles.isResizing]: header.column.getIsResizing(),
                  })}
                /> */}
                </Th>
              ))}
              <Th className={classNames(styles.table_header)} w={24}>
                <Button _hover={{background: "#3ABF2B"}} bg="#34C924" color="white" size="sm">Add new user</Button>
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
                  icon={<DeleteIcon />}
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
  );
}

export default AdminUserTable;
