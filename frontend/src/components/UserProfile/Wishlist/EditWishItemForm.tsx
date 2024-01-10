import { useForm } from "react-hook-form";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Checkbox,
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
  prevWishLink?: string;
  prevWishImg?: string;
  closeWishItemIsEdit: () => void;
  editWishItemFunc: (
    wishId: number,
    title?: string,
    description?: string,
    linkToSite?: string,
    imgBinary?: File,
    deleteImage?:boolean,
  ) => Promise<void>;
}

interface IEditWishItem {
  wishName: string;
  wishDesc: string;
  wishLink: string;
  wishImg: string;
  wishImgDelete: boolean;
}

function EditWishItemForm(props: IEditWishItemForm) {
  const {
    wishId,
    prevWishName,
    prevWishDesc,
    prevWishLink,
    prevWishImg,
    closeWishItemIsEdit,
    editWishItemFunc,
  } = props;
  const [wishName, setWishName] = useState(prevWishName);
  const [wishDesc, setWishDesc] = useState(prevWishDesc);
  const [wishLink, setWishLink] = useState(prevWishLink);
  const [wishImgBin, setWishImgBin] = useState<File | undefined>(undefined);
  const [wishImgDelete, setWishImgDelete] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IEditWishItem>({
    defaultValues: {
      wishName: prevWishName,
      wishDesc: prevWishDesc,
      wishLink: prevWishLink, 
      wishImg: prevWishImg,
    },
  });

  const onSubmitHandler = async (values: IEditWishItem) => {
    if (wishId) {
      editWishItemFunc(wishId, wishName, wishDesc, wishLink, wishImgBin, wishImgDelete);
      setWishName("");
      setWishDesc("");
      setWishImgBin(undefined);
      reset();
      closeWishItemIsEdit();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                setWishName(e.target.value);
              },
            })}
          />
        </FormControl>
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
        <FormControl>
          <FormLabel htmlFor="wishLink">Wish Link</FormLabel>
          <Input
            type="text"
            id="wishLink"
            placeholder="Wish Link"
            {...register("wishLink", {
              onChange: (e) => {
                setWishLink(e.target.value);
              },
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="wishImg">Wish image</FormLabel>
          <Input
            isDisabled={wishImgDelete}
            type="file"
            id="wishImg"
            placeholder="Wish image"
            {...register("wishImg", { onChange: handleFileChange })}
          />
        </FormControl>
        <Checkbox
          id="wishImgDelete"
          {...register("wishImgDelete", {
            onChange: (e) => {
              setWishImgDelete(e.target.checked);
            },
          })}
        >
          Delete image
        </Checkbox>

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
