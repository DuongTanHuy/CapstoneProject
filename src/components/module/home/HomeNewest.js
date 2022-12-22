import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import PostItem from "../post/PostItem";
import PostNewestItem from "../post/PostNewestItem";
import PostNewestLarge from "../post/PostNewestLarge";
import "swiper/scss";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 64px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);

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

  if (posts.length <= 0) return null;

  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Newest update</Heading>
        <div className="layout">
          <PostNewestLarge></PostNewestLarge>
          <div className="sidebar">
            <PostNewestItem></PostNewestItem>
            <PostNewestItem></PostNewestItem>
            <PostNewestItem></PostNewestItem>
          </div>
        </div>
        <div className="relative">
          <Heading>Ongoing</Heading>
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
    </HomeNewestStyles>
  );
};

export default HomeNewest;
