import { Button } from "components/button";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import parse from "html-react-parser";

const HomeBannerStyles = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  position: relative;
  max-width: 1540px;
  margin-left: auto;
  margin-right: auto;
  .banner {
    display: flex;
    align-items: center;
    justify-content: start;
  }
  .banner-content {
    position: absolute;
    top: 60px;
    left: 120px;
    color: white;
    text-shadow: 1px 1px #333;
  }
  .banner-heading {
    font-size: 46px;
    margin-bottom: 20px;
    font-weight: 600;
  }
  .banner-desc {
    line-height: 1.75;
    margin-bottom: 40px;
    max-width: 600px;
  }
`;

const HomeBanner = () => {
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

  return (
    <Swiper
      id="scroll"
      className="grid-layout scroll-smooth"
      grabCursor={"true"}
      spaceBetween={46}
      slidesPerView={1}
      loop={true}
      modules={[Navigation, Pagination, Autoplay]}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id}>
          <HomeBannerStyles>
            <img
              className="w-full h-hull max-h-[390px] object-cover rounded-lg shadow-lg"
              src={post.image}
              alt=""
            />
            <div className="container">
              <div className="banner">
                <div className="banner-content">
                  <h1 className="banner-heading">{post.title}</h1>
                  <p className="banner-desc">
                    {parse(post?.content || "")[0].props.children.slice(0, 300)}
                  </p>
                  <Button to={`${post.slug}?id=${post.id}`} kind="secondary">
                    Participatel
                  </Button>
                </div>
              </div>
            </div>
          </HomeBannerStyles>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeBanner;
