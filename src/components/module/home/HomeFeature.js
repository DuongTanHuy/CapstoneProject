import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
        <div className="grid-layout">
          {posts.map((post) => (
            <PostFeatureItem key={post.id} data={post}></PostFeatureItem>
          ))}
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
