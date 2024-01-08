import { useForm } from "react-hook-form";
import UserInput from "../../UserInput/UserInput";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext, UserContextType } from "../../../context/UserContext";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";

interface IEditWishItemForm {
  wishId?: number;
  prevWishName?: string;
  prevWishDesc?: string;
  prevWishImg?: string;
  closeWishItemIsEdit: ()=>void;
  editWishItemFunc: (
    wishId: number,
    title?: string,
    description?: string,
    linkToSite?: string,
    imgBinary?: File
  ) => Promise<void>;
}

interface IEditWishItem {
  wishName: string;
  wishDesc: string;
  wishImg: string;
}

function EditWishItemForm(props: IEditWishItemForm) {
  console.log("EditWishFormRerender");
  const { wishId, prevWishName, prevWishDesc, prevWishImg, closeWishItemIsEdit, editWishItemFunc } =
    props;
  const [wishName, setWishName] = useState(prevWishName);
  const [wishDesc, setWishDesc] = useState(prevWishDesc);
  const [wishImgBin, setWishImgBin] = useState<File | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IEditWishItem>({
    defaultValues: {
      wishName: prevWishName,
      wishDesc: prevWishDesc,
      wishImg: prevWishImg,
    },
  });

  const { getAccessCookie } = useContext(UserContext) as UserContextType;

  const onSubmitHandler = async (values: IEditWishItem) => {
    if (wishId) {
      editWishItemFunc(wishId, wishName, wishDesc, undefined, wishImgBin);
      setWishName("");
      setWishDesc("");
      setWishImgBin(undefined);
      reset();
      closeWishItemIsEdit();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setWishImgBin(e.target.files[0]);
    }
  };

  useEffect(() => {
    return () => {
      reset();
      setWishName("");
      setWishDesc("");
      setWishImgBin(undefined);
    };
  }, []);

  return (
    <>
      <Heading as="h3" mb={5} textAlign="center" size="lg">
        Edit Wish Item
      </Heading>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl>
          <FormLabel htmlFor="wishName">Wish name</FormLabel>
          <Input
            type="text"
            id="wishName"
            placeholder="Wish name"
            {...register("wishName", {
              onChange: (e) => {
                console.log("asdfasdf");
                setWishName(e.target.value);
              },
            })}
          />
        </FormControl>
        {/* <UserInput
          type="text"
          id="wishName"
          className="user-input"
          placeholder="Wish name"
          {...register("wishName", {
            onChange: (e) => {
              setWishName(e.target.value);
            },
          })}
        /> */}
        <FormControl>
          <FormLabel htmlFor="wishDesc">Wish description</FormLabel>
          <Input
            type="text"
            id="wishDesc"
            placeholder="Wish description"
            {...register("wishDesc", {
              onChange: (e) => {
                setWishDesc(e.target.value);
              },
            })}
          />
        </FormControl>
        {/* <UserInput
          type="text"
          id="wishDesc"
          {...register("wishDesc", {
            onChange: (e) => {
              setWishDesc(e.target.value);
            },
          })}
          className="user-input"
          placeholder="Wish description"
        /> */}
        <FormControl>
          <FormLabel htmlFor="wishImg">Wish image</FormLabel>
          <Input
            type="file"
            id="wishImg"
            placeholder="Wish image"
            {...register("wishImg", { onChange: handleFileChange })}
          />
        </FormControl>
        {/* <UserInput
          type="file"
          id="wishImg"
          {...register("wishImg", { onChange: handleFileChange })}
          className="user-input"
          placeholder="Wish image"
        /> */}
        <Flex justifyContent="center" alignItems="center" mt={5}>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            rightIcon={<ArrowForwardIcon />}
          >
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default React.memo(EditWishItemForm);
