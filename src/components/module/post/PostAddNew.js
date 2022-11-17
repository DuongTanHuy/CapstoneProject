import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
import { postStatus } from "untils/constants";

import ImageUpload from "components/image/ImageUpload";
import useHandleImage from "hooks/useHandleImage";
import Toggle from "components/toggle/Toggle";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import { useAuth } from "contexts/auth-context";
import { toast } from "react-toastify";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      hot: false,
      categoryId: "",
      image: "",
    },
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const cloneValue = { ...values };
      cloneValue.slug = slugify(values.slug || values.title, { lower: true });
      cloneValue.status = Number(values.status);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValue,
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
      handleResetUpload();
      setSelectCategory({});
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
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

  return (
    <PostAddNewStyles>
      <h1 className="dashboard-heading">Create auction</h1>
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
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
          <Field>
            <Label>Status</Label>
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
            </div>
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
          <div className="flex flex-row justify-between transition-all">
            <div className="flex-1 mr-20">
              <Field>
                <Label>Category</Label>
                <Dropdown>
                  <Dropdown.Select
                    placeholder={`${
                      selectCategory?.name || "Choose auction type"
                    }`}
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
                {/* {selectCategory.name && (
                  <span className="inline-block p-3 rounded-lg bg-gray-200 text-sm font-medium">
                    {selectCategory.name}
                  </span>
                )} */}
              </Field>
            </div>
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
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
