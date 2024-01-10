import { useForm } from "react-hook-form";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import {  Button, Flex, FormControl, FormLabel, Heading, Input } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";


interface IAddWishItemForm {
  addWishItemToWishlistFunc: (title: string, description: string, linkToSite?: string, imgBinary?: File) => Promise<void>;
}

interface IAddWishItem {
  wishName: string;
  wishDesc: string;
  wishLink: string;
  wishImg: File;
}

function AddWishItemForm(props: IAddWishItemForm) {
  const { addWishItemToWishlistFunc } = props;
  const [wishName, setWishName] = useState("");
  const [wishDesc, setWishDesc] = useState("");
  const [wishLink, setWishLink] = useState("");
  const [wishImgBin, setWishImgBin] = useState<File | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IAddWishItem>();

  const onSubmitHandler = async (values: IAddWishItem) => {
    addWishItemToWishlistFunc(wishName, wishDesc, wishLink, wishImgBin);
    setWishName("");
    setWishDesc("");
    setWishLink("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <FormLabel htmlFor="wishLink">Wish external link</FormLabel>
          <Input
            type="text"
            id="wishLink"
            placeholder="Wish eternal link"
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
            type="file"
            id="wishImg"
            placeholder="Wish image"
            {...register("wishImg", { onChange: handleFileChange })}
          />
        </FormControl>
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
