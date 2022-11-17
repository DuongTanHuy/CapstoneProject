import { Button } from "components/button";
import { useAuth } from "contexts/auth-context";
import React from "react";
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
    margin-left: auto;
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
                <NavLink to={item.url} className="menu-link">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
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
            <div className="header-auth">
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
