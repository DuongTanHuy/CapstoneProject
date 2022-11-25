import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import Toggle from "components/toggle/Toggle";
import { db } from "firebase-app/firebase-config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import useHandleImage from "hooks/useHandleImage";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { postStatus } from "untils/constants";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import ReactQuill, { Quill } from "react-quill";
import DashboardHeading from "components/module/dashboard/DashboardHeading";

Quill.register("modules/imageUploader", ImageUploader);

const ManagePostUpdate = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      hot: false,
      categoryId: "",
      image: "",
      userId: "",
      imageName: "",
      author: "",
      createdAt: "",
    },
  });

  const [params] = useSearchParams();
  const postId = params.get("id");
  const navigate = useNavigate();

  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [content, setContent] = useState("");

  const { image, setImage } = useHandleImage(setValue, getValues);

  useEffect(() => {
    async function fetchDate() {
      //lay mot truong du lieu dung doc
      const colRef = doc(db, "posts", postId);
      const singleDoc = await getDoc(colRef);

      reset(singleDoc.data());

      setContent(singleDoc.data().content);

      setImage(singleDoc.data().image);
      setSelectCategory(
        categories.find(
          (category) => category.id === singleDoc.data().categoryId
        )
      );
    }
    fetchDate();
  }, [categories, postId, reset, selectCategory?.name, setImage]);

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

  const handleNotification = async (values) => {
    const colRef = collection(db, "notify");
    await addDoc(colRef, {
      content: `Your bid: ${values.title} has been ${
        Number(values.status) === 1 ? "accepted" : "rejected"
      }`,
      userId: values.userId,
      createdAt: serverTimestamp(),
    });
  };

  const handleUpdate = (values) => {
    if (!isValid) return;
    console.log(values);

    const colRef = doc(db, "posts", postId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(colRef, {
          status: Number(values.status),
        });

        handleNotification(values);

        Swal.fire("Updated!", "Your file has been update.", "success");

        navigate("/manage/pending");
      }
    });
  };

  const module = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
    }),
    []
  );

  if (!postId) return null;

  return (
    <div>
      <DashboardHeading
        title="Update your Auction"
        desc="Change your auction information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-cols-2 gap-x-10 mb-10">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              readOnly
              required
            ></Input>
          </Field>
          <Field>
            <Label>Author</Label>
            <Input
              name="author"
              control={control}
              placeholder="Find the author"
              readOnly
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
            </Dropdown>
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
              onClick={(event) => {
                event.preventDefault();
                console.log("Your can't upload image");
              }}
              className="h-[250px]"
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
              readOnly
            ></ReactQuill>
          </Field>
          <div className="flex flex-row justify-between transition-all">
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
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update your Auction
        </Button>
      </form>
    </div>
  );
};

export default ManagePostUpdate;
