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
  Image,
  Icon,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserData } from "../../../pages/AdminPage/AdminPage";
import React from "react";
import styles from "../tableStyles.module.css";
import classNames from "classnames";
import { DeleteIcon, EditIcon, UpDownIcon, ViewIcon } from "@chakra-ui/icons";
import { RiImageEditLine } from "react-icons/ri";
import ModalWindow from "../../ModalWindow/ModalWindow";
import RegistrationForm from "../../Authentication/RegistrationForm";
import AdminUserEditForm from "../AdminForms/AdminUserEditForm";
import UserEditAvatarForm from "../../UserProfile/UserEditAvatarForm";

const baseImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
const fixImageUrl = (url: string | undefined) => {
  return url ? url.replace("/", "%2F") : url;
};

interface IAdminUserTable {
  currentData: UserData[];
  registerNewUserFunc: (
    firstName: string,
    username: string,
    email: string,
    password: string,
    lastName?: string
  ) => Promise<void>;
  deleteUserFunc: (username: string) => Promise<void>;
  editUserFunc: (
    prevFirstName: string,
    prevLastName: string | undefined,
    prevUsername: string,
    prevEmail: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  editUserAvatarFunc: (
    deleteUserAvatar: boolean,
    imgBinary?: File,
    username?: string
  ) => Promise<void>;
  goToUserWishes: (username: string) => void;
}

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
    accessorKey: "image_url",
    header: "Image",
    enableSorting: false,
    cell: (props: any) => {
      const url = props.getValue()
        ? baseImageUrl + fixImageUrl(props.getValue()) + "?alt=media"
        : "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media";
      return <Image src={url} />;
    },
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

function AdminUserTable(props: IAdminUserTable) {
  const {
    currentData,
    registerNewUserFunc,
    deleteUserFunc,
    editUserFunc,
    editUserAvatarFunc,
    goToUserWishes,
  } = props;
  const [data, setData] = React.useState(currentData);
  const [addNewUserIsActive, setAddNewUserIsActive] =
    React.useState<boolean>(false);
  const [columnFilters, ] = React.useState<
    { id: string; value: string }[]
  >([]);
  const [currentEditUser, setCurrentEditUser] = React.useState<
    UserData | undefined
  >(undefined);
  const editForm = React.useRef("");
  const [editFormIsActive, setEditFormIsActive] =
    React.useState<boolean>(false);
  const [imageEditFormIsActive, setImageEditFormIsActive] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    setData(currentData);
  }, [currentData]);

  React.useEffect(() => {
    if (currentEditUser && editForm.current === "profileData") {
      setEditFormIsActive(true);
    } else if (currentEditUser && editForm.current === "image") {
      setImageEditFormIsActive(true);
    } else {
      setImageEditFormIsActive(false);
      setEditFormIsActive(false);
    }
  }, [currentEditUser]);

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



  return (
    <>
      <ModalWindow
        active={addNewUserIsActive}
        setActive={setAddNewUserIsActive}
      >
        {addNewUserIsActive && (
          <RegistrationForm registerUser={registerNewUserFunc} />
        )}
      </ModalWindow>
      <ModalWindow active={editFormIsActive} setActive={setEditFormIsActive}>
        {editFormIsActive && currentEditUser && (
          <AdminUserEditForm
            prevFirstName={currentEditUser.first_name}
            prevLastName={currentEditUser.last_name}
            prevUsername={currentEditUser.username}
            prevEmail={currentEditUser.email}
            editUserFunc={editUserFunc}
            setActiveModal={setCurrentEditUser}
          />
        )}
      </ModalWindow>
      <ModalWindow
        active={imageEditFormIsActive}
        setActive={setImageEditFormIsActive}
      >
        {imageEditFormIsActive && currentEditUser && (
          <UserEditAvatarForm
            editUserAvatar={editUserAvatarFunc}
            username={currentEditUser.username}
            setActiveModal={setImageEditFormIsActive}
          />
        )}
      </ModalWindow>
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
                <Th className={classNames(styles.table_header)} w={24}>
                  <Button
                    _hover={{ background: "#3ABF2B" }}
                    bg="#34C924"
                    color="white"
                    size="sm"
                    onClick={() => {
                      setAddNewUserIsActive(true);
                    }}
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
                      goToUserWishes(row.original.username);
                    }}
                  />
                  <IconButton
                    aria-label="Edit user data"
                    bg={"transparent"}
                    icon={<EditIcon />}
                    onClick={() => {
                      editForm.current = "profileData";
                      setCurrentEditUser(row.original);
                    }}
                  />
                  <IconButton
                    aria-label="Edit user data"
                    bg={"transparent"}
                    icon={<Icon as={RiImageEditLine} />}
                    onClick={() => {
                      editForm.current = "image";
                      setCurrentEditUser(row.original);
                    }}
                  />
                  <IconButton
                    aria-label="Delete row"
                    bg={"transparent"}
                    icon={<DeleteIcon color={"#E32636"} />}
                    onClick={() => {
                      deleteUserFunc(row.original.username);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
    </>
  );
}

export default AdminUserTable;
