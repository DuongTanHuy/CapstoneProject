import { db } from "firebase-app/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }
    &-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #6b6b6b;
      margin-top: auto;
    }
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
    &-title {
      margin-bottom: 8px;
    }
  }
`;

const PostItem = ({ data }) => {
  const [categories, setCategories] = useState();
  // const [user, setUser] = useState();
  const date = data?.createdAt.seconds
    ? new Date(data?.createdAt.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  useEffect(() => {
    async function fetchCategory() {
      if (data?.userId) {
        const docRef = doc(db, "categories", data.categoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap) setCategories(docSnap.data());
      }
    }

    fetchCategory();
  }, [data?.categoryId, data?.userId]);

  if (!data || !data.id) return null;

  return (
    <PostItemStyles>
      <PostImage url={data.image}></PostImage>
      {categories?.name && (
        <PostCategory to={categories?.slug}>{categories?.name}</PostCategory>
      )}
      <PostTitle to={`${data.slug}?id=${data.id}`} size="normal">
        {data.title}
      </PostTitle>
      <div className="absolute bottom-0">
        <PostMeta
          date={formatDate}
          to={slugify(data?.author || "", { lower: true })}
          authorName={data?.author}
        ></PostMeta>
      </div>
    </PostItemStyles>
  );
};

export default PostItem;
