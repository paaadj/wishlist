import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

interface IReserveWishItemForm {
  updateReservation: (itemId: number, date: string) => Promise<void>;
  wishId: number | undefined;
}

interface IReserveWishItem {
  wishDate: string | undefined;
}

function ReserveWishItemForm(props: IReserveWishItemForm) {
  const { updateReservation, wishId } = props;
  const [date, setDate] = React.useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IReserveWishItem>();

  const onSubmitHandler = async (values: IReserveWishItem) => {
    const parsedDate = date?.replace("T", " ");
    if (wishId) {
      updateReservation(wishId, parsedDate);
    }
    setDate("");

    reset();
  };

  return (
    <>
      <Heading as="h3" mb={5} textAlign="center" size="lg">
        Reserve Wish Item
      </Heading>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl>
          <FormLabel htmlFor="wishDate">Notification date</FormLabel>
          <Input
            type="datetime-local"
            id="wishDate"
            placeholder="Wish date"
            {...register("wishDate", {
              onChange: (e) => {
                setDate(e.target.value);
              },
            })}
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
            Reserve
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default ReserveWishItemForm;
