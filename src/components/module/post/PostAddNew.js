import { Button } from "components/button";
// import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
// import { postStatus } from "untils/constants";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";

import ImageUpload from "components/image/ImageUpload";
import useHandleImage from "hooks/useHandleImage";
import Toggle from "components/toggle/Toggle";
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

const PostAddNewStyles = styled.div``;

Quill.register("modules/imageUploader", ImageUploader);

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    watch,
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
  const watchHot = watch("hot");
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

  const addPostHandler = async (values) => {
    if (!isValid) return;
    setLoading(true);
    try {
      const cloneValue = { ...values };
      cloneValue.slug = slugify(values.title, { lower: true });
      cloneValue.status = Number(2);
      cloneValue.author = userInfo?.displayName;

      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValue,
        content: content,
        image,
        userId: userInfo.uid,
        createdAt: serverTimestamp(),
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
          {/* <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field> */}
          <Field>
            <Label>Category</Label>
            <Dropdown>
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
            {/* <Label>Status</Label>
            <div className="flex items-center gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                onClick={() => setValue("status", postStatus.APPROVED)}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                onClick={() => setValue("status", postStatus.PENDING)}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                onClick={() => setValue("status", postStatus.REJECTED)}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </div> */}
          </Field>
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
            {/* <Input
                control={control}
                name="detail"
                className="min-h-[100px]"
              ></Input> */}
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
              <div className="flex flex-col items-center gap-y-[30px]">
                <Label>Feature auction</Label>
                <Toggle
                  on={watchHot === true}
                  onClick={() => setValue("hot", !watchHot)}
                ></Toggle>
              </div>
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
    </PostAddNewStyles>
  );
};

export default PostAddNew;
