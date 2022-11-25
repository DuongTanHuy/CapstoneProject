import { Button } from "components/button";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const menuList = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/auction",
    title: "Auction",
  },
  {
    url: "/profile",
    title: "Profile",
  },
];

const HeaderStyles = styled.header`
  padding: 16px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
  }
  .search {
    margin-left: 20px;
    padding: 16px 26px;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 20px;
  }
  .search-input {
    flex: 1;
    outline: none;
    padding-right: 46px;
    font-weight: 500;
  }
  .search-icon {
    position: absolute;
    right: 26px;
  }
`;

// function getLastName(name) {
//   const length = name.split(" ").length;
//   return name.split(" ")[length - 1];
// }

const Header = () => {
  const { userInfo } = useAuth();
  const [hit, setHit] = useState(false);
  const [notify, setNotify] = useState([]);
  const date = notify?.createdAt?.seconds
    ? new Date(notify?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  useEffect(() => {
    const colRef = collection(db, "notify");
    const queries = query(
      colRef, // set status (pending, apply...) tai day where("status","==", 1)
      where("userId", "==", userInfo?.uid ? userInfo.uid : "")
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setNotify(result);
    });
  }, [userInfo?.uid]);

  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to={"/"}>
            <img srcSet="/Logo.png 3x" alt="SmartTender" className="logo" />
          </NavLink>
          <ul className="menu">
            {menuList.map((item) => (
              <li className="menu-item" key={item.title}>
                {item.title === "Profile" ? (
                  <NavLink
                    to={item.url + `?id=${userInfo?.uid}`}
                    className="menu-link"
                  >
                    {item.title}
                  </NavLink>
                ) : (
                  <NavLink to={item.url} className="menu-link">
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          <div className="ml-auto z-10 cursor-pointer">
            <li className="list-none flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => setHit(!hit)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                />
              </svg>

              <div
                className={`transition-all rounded-lg max-w-[400px] bg-white shadow-lg ${
                  hit ? "absolute top-14" : "hidden"
                }`}
              >
                <ul>
                  <li className="text-xl p-3 rounded-lg font-semibold bg-gray-200">
                    <h6 className="f-18 mb-0">Notifications</h6>
                  </li>
                  {notify.length > 0 &&
                    notify.map((item) => (
                      <li key={item.id} className="p-3 hover:bg-gray-100">
                        <p className=" text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 inline-block text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          <span> {item.content} </span>
                          <span className="text-gray-300">{formatDate}</span>
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          </div>
          <div className="search">
            <input type="text" className="search-input" placeholder="Search" />
            <span className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-[#292D32]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
          </div>
          {!userInfo ? (
            <Button
              type="button"
              height="58px"
              className="header-button"
              to="/sign-up"
            >
              Sign Up
            </Button>
          ) : (
            <div className="header-auth flex flex-col items-center justify-center">
              <span>Welcome back! </span>
              <strong className="text-primary">{userInfo?.displayName}</strong>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
