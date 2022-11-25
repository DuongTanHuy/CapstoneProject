import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import PostFeatureItem from "../post/PostFeatureItem";
const HomeFeatureStyles = styled.div``;

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

  if (posts.length <= 0) return null;

  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Feature</Heading>
        <Swiper
          className="grid-layout"
          grabCursor={"true"}
          spaceBetween={46}
          scrollbar={{ draggable: true }}
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
