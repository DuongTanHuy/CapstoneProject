import { Button } from "components/button";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import ImageUpload from "components/image/ImageUpload";
import useHandleImage from "hooks/useHandleImage";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import { useAuth } from "contexts/auth-context";
import { toast } from "react-toastify";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useNavigate } from "react-router-dom";
import { useMeta } from "contexts/metamask-context";
import getWeb3 from "getWeb3";
import BlindAuction from "../../../contracts/BlindAuction.json";

const PostAddNewStyles = styled.div``;

Quill.register("modules/imageUploader", ImageUploader);

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const {
    web3,
    setAccounts,
    blindContract,
    initialized,
    setInit,
    setWeb3,
    currentAccount,
    setCurrentAccounts,
    setBlindContract,
  } = useMeta();

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      author: "",
      title: "",
      slug: "",
      status: 2,
      hot: false,
      categoryId: "",
      image: "",
    },
  });
  // const watchStatus = watch("status");
  // const watchHot = watch("hot");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImg,
    handleResetUpload,
  } = useHandleImage(setValue, getValues);

  // const watchCategory = watch("category");
  // console.log("PostAddNew ~ watchCategory", watchCategory);

  const handleConnect = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork2 = BlindAuction.networks[networkId];
      const instance2 = await new web3.eth.Contract(
        BlindAuction.abi,
        deployedNetwork2 && deployedNetwork2?.address
      );
      instance2.options.address = deployedNetwork2?.address;

      setWeb3(web3);
      setAccounts(accounts);
      setBlindContract(instance2);
      setInit(true);
      setCurrentAccounts(accounts[0]);
      init();
    } catch (error) {
      console.error(error);
    }
  };

  const init = async () => {
    if (initialized === false) return;
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts);
  };

  const addPostHandler = async (values) => {
    if (!isValid) return;
    if (!web3) {
      toast.error("You must login to metamask! Click here.", {
        pauseOnHover: false,
        onClick: () => handleConnect(),
      });
      return;
    }
    setLoading(true);
    async function createAuction() {
      const accounts = await web3?.eth?.getAccounts();
      setAccounts(accounts);

      let bidding_time = parseInt(
        (new Date(values.endDay).getTime() - Date.now()) / 1000
      );
      console.log(bidding_time);
      // let reveal_time =
      //   parseInt((new Date(values.end).getTime() - Date.now()) / 1000) -
      //   bidding_time;
      if (bidding_time <= 0) {
        alert("Invalid Bidding Deadline");
        return false;
      }
      // if (reveal_time <= 0) {
      //   alert("Invalid Reveal Deadline");
      //   return false;
      // }

      await blindContract.methods
        .auctionItem(
          values.prName,
          // values.desc,
          Number(values.startPrice),
          bidding_time
          // reveal_time
        )
        .send({ from: accounts[0] });
    }

    createAuction();

    try {
      const cloneValue = { ...values };
      cloneValue.slug = slugify(values.title, { lower: true });
      cloneValue.status = Number(2);
      cloneValue.author = userInfo?.displayName;

      // console.log(await blindContract.methods.getAllAuctions());

      const marketListings = await blindContract.methods
        .getAllAuctions()
        .call({ from: currentAccount });
      console.log(marketListings);

      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValue,
        content: content,
        image,
        userId: userInfo.uid,
        createdAt: serverTimestamp(),
        auctionID: Number(marketListings.length),
      });
      toast.success("Your bid has been successfully created!");
      reset({
        author: "",
        title: "",
        slug: "",
        status: 2,
        hot: false,
        categoryId: "",
        image: "",
      });
      setContent("");
      handleResetUpload();
      setSelectCategory({});

      navigate("/auction");
    } catch (error) {
      toast.error("Can't register for auction!");
      console.log(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef);
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
        setCategories(result);
      });
    }
    getData();
  }, []);

  const handleClickOption = (category) => {
    setValue("categoryId", category.id);
    setSelectCategory(category);
  };

  const module = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
    }),
    []
  );

  return (
    <PostAddNewStyles>
      <DashboardHeading
        title="Create auction"
        desc="Register your bid package"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Author</Label>
            <Input
              name="author"
              control={control}
              placeholder="Find the author"
            ></Input>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown className="z-10">
              <Dropdown.Select
                placeholder={`${selectCategory?.name || "Choose auction type"}`}
              ></Dropdown.Select>
              <Dropdown.List>
                {categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <Dropdown.Option
                      key={category.id}
                      onClick={() => handleClickOption(category)}
                    >
                      {category.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
          </Field>
          <Field>
            <Label>Product Name</Label>
            <Input
              name="prName"
              control={control}
              placeholder="Enter your product name"
            ></Input>
          </Field>
          {/* <Input
              name="desc"
              control={control}
              placeholder="Enter your product description"
            ></Input> */}
          {selectCategory?.name === "Secret Auction" && (
            <>
              <Field>
                {/* <Input
                  name="startPrice"
                  control={control}
                  placeholder="Enter your start price"
                ></Input> */}
              </Field>
              <div className="grid grid-cols-2 gap-x-10">
                <div className="relative">
                  <Label>Start Price</Label>
                  <Input
                    className="mt-5"
                    name="startPrice"
                    control={control}
                    placeholder="Enter your start price"
                  ></Input>
                  <span id="unitPrice" className="absolute top-[58px] right-4">
                    VND
                  </span>
                </div>
                <div>
                  <Label>End Day</Label>
                  <Input
                    className="mt-5"
                    name="endDay"
                    type="dateTime-local"
                    control={control}
                  ></Input>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-10 mb-3">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              handleDeleteImg={handleDeleteImg}
              className="h-[250px]"
              progress={progress}
              image={image}
            ></ImageUpload>
          </Field>
          <Field>
            <Label>Enter your detail</Label>
            <ReactQuill
              className="w-full min-h-[200px] entry-content"
              modules={module}
              theme="snow"
              value={content}
              onChange={setContent}
            ></ReactQuill>
          </Field>
          <div className="flex flex-row justify-between transition-all gap-x-10">
            <Field>
              {/* <div className="flex flex-col items-center gap-y-[30px]">
                <Label>Feature auction</Label>
                <Toggle
                  on={watchHot === true}
                  onClick={() => setValue("hot", !watchHot)}
                ></Toggle>
              </div> */}
            </Field>
          </div>
        </div>

        <Button
          type="submit"
          className="mx-auto w-[260px]"
          isLoading={loading}
          disabled={loading}
        >
          Create your auction
        </Button>
      </form>
      {/* <MainCreateBlock></MainCreateBlock> */}
    </PostAddNewStyles>
  );
};

export default PostAddNew;
