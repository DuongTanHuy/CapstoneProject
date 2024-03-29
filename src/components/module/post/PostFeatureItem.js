import { db } from "firebase-app/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import "../../../../src/item.scss";
import parse from "html-react-parser";

const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  :hover img {
    transform: scale(1.1);
    transition: all 0.1s linear;
  }
  overflow: hidden;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }

  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`;
const PostFeatureItem = ({ data }) => {
  const [categories, setCategories] = useState();
  // const [user, setUser] = useState();
  const date = data?.createdAt.seconds
    ? new Date(data?.createdAt.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategory() {
      if (data.userId) {
        const docRef = doc(db, "categories", data.categoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap) setCategories(docSnap.data());
      }
    }

    fetchCategory();
  }, [data.categoryId, data.userId]);

  // useEffect(() => {
  //   async function fetchUser() {
  //     if (data.userId) {
  //       const docRef = doc(db, "users", data.userId);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap) setUser(docSnap.data());
  //     }
  //   }

  //   fetchUser();
  // }, [data.userId]);

  if (!data || !data.id) return null;

  return (
    <div className="card__giratorio">
      <div className="card__giratorio-conteudo">
        <div className="card__giratorio-conteudo--frente">
          <PostFeatureItemStyles>
            <PostImage url={data.image}></PostImage>
            <div className="post-overlay"></div>
            <div
              className="post-content"
              onClick={() => navigate(`${data.slug}?id=${data.id}`)}
            >
              <div className="post-top">
                {categories?.name && (
                  <PostCategory to={categories?.slug}>
                    {categories?.name}
                  </PostCategory>
                )}
                <PostMeta
                  date={formatDate}
                  to={slugify(data?.author || "", { lower: true })}
                  authorName={data?.author}
                ></PostMeta>
              </div>
              <PostTitle to={`${data.slug}?id=${data.id}`} size="big">
                {data.title}
              </PostTitle>
            </div>
          </PostFeatureItemStyles>
        </div>
        <div className="card__giratorio-conteudo--traseira pl-3">
          <img src="/Logo.png" alt="" className="logo-item" />
          <h1>{data?.title}</h1>
          <p>
            {parse(data?.content || "")[0]?.props.children.slice(0, 100)}...
          </p>
          <p id="unitPrice" className="!text-white">
            Start price:&nbsp;{data.startPrice}&nbsp; VND
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostFeatureItem;
