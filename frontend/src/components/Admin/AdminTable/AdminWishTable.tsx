import {
  Button,
  IconButton,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Image,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  UserData,
  WishData,
  wishesData,
} from "../../../pages/AdminPage/AdminPage";
import React from "react";
import styles from "../tableStyles.module.css";
import classNames from "classnames";
import { DeleteIcon, EditIcon, UpDownIcon, ViewIcon } from "@chakra-ui/icons";

import Pagination from "../../Pagination/Pagination";
import Filter from "./Filter";
import ModalWindow from "../../ModalWindow/ModalWindow";
import EditWishItemForm from "../../UserProfile/Wishlist/EditWishItemForm";

const baseImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
const fixImageUrl = (url: string | undefined) => {
  return url ? url.replace("/", "%2F") : url;
};

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: (props: any) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: (props: any) => (
      <p>{props.getValue() ? props.getValue().username : "No"}</p>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (props: any) => <Text noOfLines={2}>{props.getValue()}</Text>,
  },
  {
    accessorKey: "link",
    header: "Link",
    enableSorting: false,
    cell: (props: any) => <Link onClick={()=>{window.open(props.getValue(), "_blank")}}>{props.getValue() ?? ""}</Link>,
  },
  {
    accessorKey: "image_url",
    header: "Image",
    enableSorting: false,
    cell: (props: any) => {
      const url = props.getValue()
        ? baseImageUrl + fixImageUrl(props.getValue())
        : "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media";
      return <Image src={url} />;
    },
  },
  {
    accessorKey: "reserved_user",
    header: "Reserved user",
    cell: (props: any) => (
      <p>{props.getValue() ? props.getValue().username : "No"}</p>
    ),
  },
];
interface IAdminWishTable {
  currentData: WishData[];
  deleteWishItemFunc: (item_id: number) => Promise<void>;
  editWishItemFunc: (
    wishId: number,
    title?: string,
    description?: string,
    linkToSite?: string,
    imgBinary?: File
  ) => Promise<void>;
}
function AdminWishTable(props: IAdminWishTable) {
  const { currentData, deleteWishItemFunc, editWishItemFunc } = props;
  const [data, setData] = React.useState<WishData[]>(currentData);
  const [currentEditWishItem, setCurrentEditWishItem] = React.useState<
    WishData | undefined
  >(undefined);
  const [editFormIsActive, setEditFormIsActive] =
    React.useState<boolean>(false);
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

  React.useEffect(() => {
    setData(currentData);
  }, [currentData]);

  React.useEffect(() => {
    if (currentEditWishItem) {
      setEditFormIsActive(true);
    } else {
      setEditFormIsActive(false);
    }
  }, [currentEditWishItem]);
  const handleCloseWishItemIsEdit = React.useCallback(() => {
    setEditFormIsActive(false);
  }, []);
  const updateData = async (rowId: number, value: Omit<WishData, "id">) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { id: row.id, ...value } : row))
    );
  };

  return (
    <>
      <ModalWindow active={editFormIsActive} setActive={setEditFormIsActive}>
        {editFormIsActive && currentEditWishItem && (
          <EditWishItemForm
            wishId={currentEditWishItem.id}
            prevWishName={currentEditWishItem.title}
            prevWishDesc={currentEditWishItem.description}
            closeWishItemIsEdit={handleCloseWishItemIsEdit}
            editWishItemFunc={editWishItemFunc}
          />
        )}
      </ModalWindow>
      <Filter
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <TableContainer minHeight="70vh" maxHeight="80%" mb={4} overflowY="auto">
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
                      setCurrentEditWishItem(row.original);
                    }}
                  />
                  <IconButton
                    aria-label="Delete row"
                    bg={"transparent"}
                    icon={<DeleteIcon color={"#E32636"} />}
                    onClick={() => {
                      deleteWishItemFunc(row.original.id);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* <Pagination
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
      /> */}
    </>
  );
}

export default AdminWishTable;
