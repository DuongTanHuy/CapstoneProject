import { Button } from "components/button";
import React from "react";
import styled from "styled-components";

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
  return (
    <HomeBannerStyles>
      <img
        className="w-full h-hull max-h-[390px] object-cover rounded-lg shadow-lg"
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1598&q=80"
        alt=""
      />
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heading">Coming to an end</h1>
            <p className="banner-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum odit
              amet sed dolore accusamus sapiente aliquid placeat animi itaque
              in? Unde impedit mollitia velit labore! Consequatur esse nemo
              consectetur architecto.
            </p>
            <Button to="/sign-up" kind="secondary">
              Participate
            </Button>
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
