import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import PostCategory from "components/module/post/PostCategory";
import PostImage from "components/module/post/PostImage";
import PostItem from "components/module/post/PostItem";
import PostMeta from "components/module/post/PostMeta";
import { db } from "firebase-app/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import parse from "html-react-parser";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
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

  const [postDetail, setPostDetail] = useState([]);
  const [category, setCategory] = useState([]);
  const [user, setUser] = useState([]);

  const date = postDetail?.createdAt?.seconds
    ? new Date(postDetail?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "posts", detailId);
      const singleDoc = await getDoc(colRef);
      setPostDetail(singleDoc.data());
    }

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

  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postDetail.image}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6">{category.name}</PostCategory>
              <h1 className="post-heading">{postDetail.title}</h1>
              <PostMeta
                authorName={postDetail.author}
                date={formatDate}
              ></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <h2>Detail product</h2>
            <div className="entry-content">
              <div>{parse(postDetail?.content || "")}</div>
              {/* <figure>
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt=""
                />
                <figcaption>
                  Gastronomy atmosphere set aside. Slice butternut cooking home.
                </figcaption>
              </figure> */}
            </div>
            <div className="author">
              <div className="author-image">
                <img src={user?.avatar} alt="" />
              </div>
              <div className="author-content">
                <h3 className="author-name">{user?.userName}</h3>
                <p className="author-desc">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Dignissimos non animi porro voluptates quibusdam optio nulla
                  quis nihil ipsa error delectus temporibus nesciunt, nam
                  officiis adipisci suscipit voluptate eum totam!
                </p>
              </div>
            </div>
          </div>
          <div className="post-related">
            <Heading>Related Posts</Heading>
            <div className="grid-layout grid-layout--primary">
              <PostItem></PostItem>
              <PostItem></PostItem>
              <PostItem></PostItem>
              <PostItem></PostItem>
            </div>
          </div>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
