import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import PostFeatureItem from "../post/PostFeatureItem";
const HomeFeatureStyles = styled.div`
  position: relative;
`;

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef, // set status (pending, apply...) tai day where("status","==", 1)
      where("hot", "==", true)
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
    const scroll = document.querySelector("#my_scroll");
    scroll.scrollLeft = scroll.scrollLeft + 513;
  };
  const handleScrollLeft = () => {
    const scroll = document.querySelector("#my_scroll");
    scroll.scrollLeft = scroll.scrollLeft - 513;
  };

  if (posts.length <= 0) return null;

  return (
    <HomeFeatureStyles className="home-block">
      <div className="container relative">
        <Heading>Feature</Heading>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="transition-all w-12 h-12 cursor-pointer bg-white rounded-full text-gray-500 absolute top-[50%] translate-y-[12px] z-40 left-0 hover:scale-125"
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
          className="transition-all w-12 h-12 cursor-pointer bg-white rounded-full text-gray-500 absolute top-[50%] translate-y-[12px] z-40 right-0 hover:scale-125"
          onClick={handleScrollRight}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <Swiper
          id="my_scroll"
          className="grid-layout scroll-smooth"
          grabCursor={"true"}
          spaceBetween={46}
          slidesPerView={"auto"}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <PostFeatureItem data={post}></PostFeatureItem>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
