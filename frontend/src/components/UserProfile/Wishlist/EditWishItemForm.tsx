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

interface IEditWishItemForm {
  updateWishlistFunction: Dispatch<SetStateAction<boolean>>;
  wishId?: number;
  prevWishName?: string;
  prevWishDesc?: string;
  prevWishImg?: string;
}

interface IEditWishItem {
  wishName: string;
  wishDesc: string;
  wishImg: string;
}

function EditWishItemForm(props: IEditWishItemForm) {
  const { updateWishlistFunction,wishId, prevWishName, prevWishDesc, prevWishImg } = props;
  const [wishName, setWishName] = useState(prevWishName);
  const [wishDesc, setWishDesc] = useState(prevWishDesc);
  const [wishImgBin, setWishImgBin] = useState<File | undefined>(undefined);

  const { register, handleSubmit, reset } = useForm<IEditWishItem>({
    defaultValues: {
      wishName: prevWishName,
      wishDesc: prevWishDesc,
      wishImg: prevWishImg,
    },
  });

  const { getAccessCookie } = useContext(UserContext) as UserContextType;

  const EditItemToWishlist = async (
    title?: string,
    description?: string,
    linkToSite?: string,
    imgBinary?: File
  ) => {
    const formData = new FormData();
    if (title) {
      formData.append("title", title);
    }
    if (description) {
      formData.append("description", description);
    }
    if (linkToSite) {
      formData.append("link", linkToSite);
    }
    if (imgBinary) {
      formData.append("image", imgBinary, imgBinary.name);
    }

    const requestParams = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    const response = await fetch(`/backend/api/update_item?item_id=${wishId}`, requestParams);
    if (response.ok) {
      console.log("Edit item");
      updateWishlistFunction((prevState) => !prevState);
    } else {
      console.log("Don't edit item");
    }
  };

  const onSubmitHandler = async (values: IEditWishItem) => {
    EditItemToWishlist(wishName, wishDesc, undefined, wishImgBin);
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
      <h3>Edit Wish Item</h3>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <UserInput
          type="text"
          id="wishName"
          className="user-input"
          placeholder="Wish name"
          {...register("wishName", {
            onChange: (e) => {
              setWishName(e.target.value);
            },
          })}
        />
        <UserInput
          type="text"
          id="wishDesc"
          {...register("wishDesc", {
            onChange: (e) => {
              setWishDesc(e.target.value);
            },
          })}
          className="user-input"
          placeholder="Wish description"
        />
        <UserInput
          type="file"
          id="wishImg"
          {...register("wishImg", { onChange: handleFileChange })}
          className="user-input"
          placeholder="Wish image"
        />
        <button>Submit</button>
      </form>
    </>
  );
}

export default EditWishItemForm;
