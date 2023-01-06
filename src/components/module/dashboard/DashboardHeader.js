// import { Button } from "components/button";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BsCurrencyDollar, BsShield } from "react-icons/bs";
import { FiCreditCard } from "react-icons/fi";
import { useState } from "react";

const DashboardHeaderStyles = styled.div`
  background-color: white;
  width: 100% !important;
  padding: 16px 40px;
  z-index: 9999999999;
  /* border-bottom: 1px solid #eee; */
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  display: flex;
  gap: 20px;
  align-items: center;
  position: fixed;
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

const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: "My Profile",
    desc: "Account Settings",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
  {
    icon: <BsShield />,
    title: "My Inbox",
    desc: "Messages & Emails",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
  },
  {
    icon: <FiCreditCard />,
    title: "My Tasks",
    desc: "To-do and Daily Tasks",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
  },
];

const DashboardHeader = () => {
  const [hit, setHit] = useState(false);

  return (
    <DashboardHeaderStyles>
      <Link
        to={"/"}
        className="logo flex flex-row gap-x-5 items-center justify-center mr-auto"
      >
        <img className="w-[50px] h-[50px]" srcSet="/Logo.png 3.6x" alt="" />
        <span className="text-primary font-semibold text-2xl">
          Smart Tender
        </span>
      </Link>
      {/* <Button to="/dashboard" className="header-button" height="52px">
        Write new post
      </Button> */}
      <div
        className="header-avatar flex flex-row gap-x-2 items-center absolute right-[180px] cursor-pointer"
        onClick={() => setHit(true)}
      >
        <img src="/avatar.jpg" alt="" />
        <div className="flex flex-col items-center">
          <p className="w-[120px] text-gray-400">Welcome back!</p>
          <p className="block font-bold">Michael</p>
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </div>
      <div
        className={`transition-all absolute right-8 top-16 bg-white shadow-lg dark:bg-[#42464D] p-8 rounded-lg w-96 ${
          hit ? "" : "translate-x-[120%]"
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg dark:text-gray-200">
            User Profile
          </p>
          <span
            className="p-3 hover:shadow-lg hover:bg-gray-100 rounded-full"
            onClick={() => setHit(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </div>
        <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
          <img
            className="rounded-full h-24 w-24"
            src="/avatar.jpg"
            alt="user-profile"
          />
          <div>
            <p className="font-semibold text-xl dark:text-gray-200">
              Michael Roberts
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Administrator
            </p>
            <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
              info@gmail.com
            </p>
          </div>
        </div>
        <div>
          {userProfileData.map((item, index) => (
            <div
              key={index}
              className="flex gap-5 border-b-1 border-color p-4 hover:bg-gray-100 cursor-pointer  dark:hover:bg-[#42464D]"
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className=" text-xl rounded-lg p-3 hover:bg-gray-300"
              >
                {item.icon}
              </button>

              <div>
                <p className="font-semibold dark:text-gray-100 ">
                  {item.title}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;
