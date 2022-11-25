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
        <Heading>Ongoing</Heading>
        {/* <div className="grid-layout grid-layout--primary">
          <PostItem></PostItem>
          <PostItem></PostItem>
          <PostItem></PostItem>
          <PostItem></PostItem>
        </div> */}
        <Swiper
          className="grid-layout grid-layout--primary"
          grabCursor={"true"}
          scrollbar={{ draggable: true }}
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
    </HomeNewestStyles>
  );
};

export default HomeNewest;
