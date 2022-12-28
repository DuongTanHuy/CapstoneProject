import Heading from "components/layout/Heading";
import PostCategory from "components/module/post/PostCategory";
import PostImage from "components/module/post/PostImage";
import PostItem from "components/module/post/PostItem";
import { db } from "firebase-app/firebase-config";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import parse from "html-react-parser";
import { Button } from "components/button";
import ModalAdvanced from "components/modal/ModalAdvanced";
import { useForm } from "react-hook-form";
import { Label } from "components/label";
import { Input } from "components/input";
import { useMeta } from "contexts/metamask-context";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import { toast } from "react-toastify";
import { useAuth } from "contexts/auth-context";
const PostDetailsPageStyles = styled.div`
  /* padding-bottom: 100px; */
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const [params] = useSearchParams();
  const detailId = params.get("id");
  const { userInfo } = useAuth();

  const [posts, setPosts] = useState([]);
  const [postDetail, setPostDetail] = useState([]);
  const [category, setCategory] = useState([]);
  const [user, setUser] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef // set status (pending, apply...) tai day where("status","==", 1)
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(result);
    });
  }, []);

  const handleScrollRight = () => {
    const scroll = document.querySelector("#my_scroll2");
    scroll.scrollLeft = scroll.scrollLeft + 384;
  };
  const handleScrollLeft = () => {
    const scroll = document.querySelector("#my_scroll2");
    scroll.scrollLeft = scroll.scrollLeft - 384;
  };

  // console.log(postDetail);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  // const date = postDetail?.createdAt?.seconds
  //   ? new Date(postDetail?.createdAt?.seconds * 1000)
  //   : new Date();
  // const formatDate = new Date(date).toLocaleDateString("vi-VI");

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "posts", detailId);
      const singleDoc = await getDoc(colRef);
      setPostDetail(singleDoc.data());
      console.log(
        await blindContract?.methods
          .revealAuction(singleDoc.data()?.auctionID)
          .call()
      );
    }

    // const result = document.querySelector("body");
    // result.scrollTop = 0;

    fetchData();
  }, [detailId]);

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(
        db,
        "categories",
        postDetail?.categoryId || "1EfE0RTX3XSna0daNiz9"
      );
      const singleDoc = await getDoc(colRef);
      setCategory(singleDoc.data());
    }

    fetchData();
  }, [postDetail.categoryId]);

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(
        db,
        "users",
        postDetail?.userId || "ocyg4P29EmXI2z2cFktoMMSscEl2"
      );
      const singleDoc = await getDoc(colRef);
      setUser(singleDoc.data());
    }

    fetchData();
  }, [postDetail?.userId]);

  console.log(postDetail);

  const { blindContract, currentAccount } = useMeta();

  const handleMakeBid = async (values) => {
    if (!isValid) return;
    const cloneValues = { ...values };
    cloneValues.valueA = Number(cloneValues.valueA);
    try {
      await blindContract?.methods
        .participateInAuction(Number(postDetail.auctionID), cloneValues.valueA)
        .send({ from: currentAccount });
      window.location.reload(false);
    } catch (error) {
      console.log(error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleOpenModal = () => {
    if (!userInfo) {
      toast.warn("You must be logged in to use this function!");
      return;
    }
    setOpenModal(true);
  };

  return (
    <PostDetailsPageStyles>
      <ModalAdvanced visible={openModal} onClose={() => setOpenModal(false)}>
        <form
          className="content bg-white relative z-10 rounded-lg p-10 min-w-[482px]"
          onSubmit={handleSubmit(handleMakeBid)}
        >
          <div
            onClick={() => setOpenModal(false)}
            className="absolute w-8 h-8 rounded-full shadow-lg cursor-pointer -top-[10px] -right-[10px] bg-white flex items-center justify-center p-1"
          >
            <svg
              className="hover:opacity-50"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.225 7L13.7375 1.4875C14.0875 1.1375 14.0875 0.6125 13.7375 0.2625C13.3875 -0.0875 12.8625 -0.0875 12.5125 0.2625L7 5.775L1.4875 0.2625C1.1375 -0.0875 0.6125 -0.0875 0.2625 0.2625C-0.0874998 0.6125 -0.0874998 1.1375 0.2625 1.4875L5.775 7L0.2625 12.5125C0.0875002 12.6875 0 12.8625 0 13.125C0 13.65 0.35 14 0.875 14C1.1375 14 1.3125 13.9125 1.4875 13.7375L7 8.225L12.5125 13.7375C12.6875 13.9125 12.8625 14 13.125 14C13.3875 14 13.5625 13.9125 13.7375 13.7375C14.0875 13.3875 14.0875 12.8625 13.7375 12.5125L8.225 7Z"
                fill="#84878B"
              />
            </svg>
          </div>
          <p className="mb-6 text-4xl font-semibold text-center text-black">
            Bid Placed
          </p>
          <hr className="bg-gray-200" />
          <div className="flex flex-col gap-y-3">
            {/* <Label className="mt-6">Secret Key</Label>
            <Input
              control={control}
              name="secretKey"
              placeholder="Enter your secret key"
            ></Input> */}
            {/* <Label className="mt-6">Auction ID</Label>
            <Input
              control={control}
              name="aucID"
              placeholder="Confirm your public key"
            ></Input> */}
            <Label className="mt-6">Value Amount</Label>
            <Input
              control={control}
              name="valueA"
              placeholder="Confirm your deposit amount"
            ></Input>
            {/* <Label className="mt-6">Deposit Amount</Label>
            <Input
              control={control}
              name="depositAmount"
              placeholder="Enter your bid amount (>2*Bid Amount)"
            ></Input> */}
            <button className="bg-[#8334cc] w-full p-3 rounded-lg text-white font-semibold mt-6">
              Confirm
            </button>
          </div>
        </form>
      </ModalAdvanced>
      <div className="container">
        <div className="post-header">
          <PostImage
            url={postDetail.image}
            className="post-feature"
          ></PostImage>
          <div className="post-info">
            <PostCategory className="mb-6">{category.name}</PostCategory>
            <h1 className="post-heading">{postDetail.title}</h1>
            {/* <PostMeta
              authorName={postDetail.author}
              date={formatDate}
              className="mb-6"
            ></PostMeta> */}
            <div className="flex flex-row max-w-[220px]">
              <Label>Author: </Label>
              <span className="ml-auto">{postDetail.author}</span>
            </div>
            {/* <div className="flex flex-row max-w-[220px]">
              <Label>Start day: </Label>
              <span className="ml-auto">{postDetail.start}</span>
            </div> */}
            <div className="flex flex-row max-w-[220px]">
              <Label>End day: </Label>
              <span className="ml-auto">{postDetail.endEnd}</span>
            </div>
            <div className="flex flex-row items-center max-w-[220px]">
              <Label>Starting price: </Label>
              <span id="unitPrice" className="my-6 ml-auto">
                {postDetail.startPrice} VND
              </span>
            </div>

            <Button
              onClick={handleOpenModal}
              type="button"
              kind="secondary"
              className="shadow-2xl border border-violet-600 hover:opacity-80"
            >
              Participate
            </Button>
          </div>
        </div>
        <div className="post-content">
          <div className="entry-content">
            <div>{parse(postDetail?.content || "")}</div>
          </div>
          <div className="author">
            <div className="author-image">
              <img src={user?.avatar} alt="" />
            </div>
            <div className="author-content">
              <h3 className="author-name">{user?.userName}</h3>
              <p className="author-desc">{user?.description}</p>
            </div>
          </div>
        </div>
        {/* <div className="post-related">
          <Heading>Related Posts</Heading>
          <div className="grid-layout grid-layout--primary">
            <PostItem></PostItem>
            <PostItem></PostItem>
            <PostItem></PostItem>
            <PostItem></PostItem>
          </div>
        </div> */}
        <div className="relative">
          <Heading>Related Posts</Heading>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="transition-all w-10 h-10 cursor-pointer bg-white rounded-full text-gray-500 absolute top-[38%] z-40 -left-[20px] hover:scale-125"
            onClick={handleScrollLeft}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="transition-all w-10 h-10 cursor-pointer bg-white rounded-full text-gray-500 absolute top-[38%] z-40 -right-[20px] hover:scale-125"
            onClick={handleScrollRight}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <Swiper
            id="my_scroll2"
            className="grid-layout grid-layout--primary scroll-smooth"
            grabCursor={"true"}
            spaceBetween={46}
            slidesPerView={"auto"}
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <PostItem data={post}></PostItem>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
