import { useForm } from "react-hook-form";
import UserInput from "../../UserInput/UserInput";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../../context/UserContext";


interface IAddWishItemForm{
  updateWishlistFunction: Dispatch<SetStateAction<boolean>>;
}

interface IAddWishItem {
  wishName: string;
  wishDesc: string;
  wishImg: string;
}

function AddWishItemForm(props: IAddWishItemForm) {
  const {updateWishlistFunction} = props;
  const [wishName, setWishName] = useState("");
  const [wishDesc, setWishDesc] = useState("");
  const [wishImgBin, setWishImgBin] = useState<File | undefined>(undefined);

  const { register, handleSubmit, reset } = useForm<IAddWishItem>();

  const { getAccessCookie } = useContext(UserContext) as UserContextType;

  const addItemToWishlist = async (
    title: string,
    description: string,
    linkToSite?: string,
    imgBinary?: File
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if(linkToSite){formData.append("link", linkToSite);}
    if(imgBinary){formData.append("image", imgBinary, imgBinary.name);}

    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    const response = await fetch(`/backend/api/add_item`, requestParams);
    if (response.ok) {
      console.log("Added item");
      updateWishlistFunction(prevState => !prevState);
    } else {
      console.log("Don't added item");
    }
  };

  const onSubmitHandler = async (values: IAddWishItem) => {
    console.log(wishName);
    console.log(wishDesc);
    console.log(wishImgBin);
    addItemToWishlist(wishName, wishDesc, undefined, wishImgBin);
    setWishName("");
    setWishDesc("");
    setWishImgBin(undefined);
    reset();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let file = e.target.files[0];
      setWishImgBin(file);
      // if (file) {
      //   fileToBinary(file, (binary: string) => setWishImgBin(binary));
      // }
    }
  };

  const arrayBufferToBinary = (buffer: any) => {
    var uint8 = new Uint8Array(buffer);
    return uint8.reduce((binary, uint8) => binary + uint8.toString(2), "");
  };

  const fileToBinary = (file: File, callback: (binary: string) => void) => {
    let reader = new FileReader();
    reader.onload = () => callback(arrayBufferToBinary(reader.result));
    reader.readAsArrayBuffer(file);
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
      <h3>Add Wish Item</h3>
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
          {...register("wishImg", { onChange: handleFileChange})}
          className="user-input"
          placeholder="Wish image"
        />
        <button>Submit</button>
      </form>
    </>
  );
}

export default AddWishItemForm;
