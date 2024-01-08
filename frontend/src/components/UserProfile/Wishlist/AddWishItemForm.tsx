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
import { Box, Button, Flex, FormControl, FormLabel, Heading, Icon, Input } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface IAddWishItemForm {
  addWishItemToWishlistFunc: (title: string, description: string, linkToSite?: string, imgBinary?: File) => Promise<void>;
}

interface IAddWishItem {
  wishName: string;
  wishDesc: string;
  wishImg: File;
}

function AddWishItemForm(props: IAddWishItemForm) {
  const { addWishItemToWishlistFunc } = props;
  const [wishName, setWishName] = useState("");
  const [wishDesc, setWishDesc] = useState("");
  const [wishImgBin, setWishImgBin] = useState<File | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IAddWishItem>();

  const { getAccessCookie } = useContext(UserContext) as UserContextType;

  

  const onSubmitHandler = async (values: IAddWishItem) => {
    addWishItemToWishlistFunc(wishName, wishDesc, undefined, wishImgBin);
    setWishName("");
    setWishDesc("");
    setWishImgBin(undefined);
    reset();
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
  }, []);

  return (
    <>
      <Heading as="h3" mb={5} textAlign="center" size="lg">Add Wish Item</Heading>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl>
          <FormLabel htmlFor="wishName">Wish name</FormLabel>
          <Input
            type="text"
            id="wishName"
            placeholder="Wish name"
            {...register("wishName", {
              onChange: (e) => {
                console.log("object");
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
                console.log(e.target.value);
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

export default AddWishItemForm;
