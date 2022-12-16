// import { Button } from "components/button";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const DashboardHeaderStyles = styled.div`
  background-color: white;
  width: 100% !important;
  padding: 16px 40px;
  /* border-bottom: 1px solid #eee; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  align-items: center;
  .header-avatar {
    width: 52px;
    height: 52px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
`;

const DashboardHeader = () => {
  return (
    <DashboardHeaderStyles>
      <Link
        to={"/"}
        className="logo flex flex-row gap-x-5 items-center justify-center mr-auto"
      >
        <img srcSet="/Logo.png 3.6x" alt="" />
        <span className="text-primary font-semibold text-2xl">
          Smart Tender
        </span>
      </Link>
      {/* <Button to="/dashboard" className="header-button" height="52px">
        Write new post
      </Button> */}
      <p>Welcome back! </p>
      <div className="header-avatar">
        <img
          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80"
          alt=""
        />
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;
