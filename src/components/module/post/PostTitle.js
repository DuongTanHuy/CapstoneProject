import React from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostTitleStyles = styled.h3`
  font-weight: 600;
  line-height: 1.5;
  display: block;
  ${(props) =>
    props.size === "normal" &&
    css`
      font-size: 16px;
    `};
  ${(props) =>
    props.size === "big" &&
    css`
      font-size: 22px;
    `};
`;

const PostTitle = ({ children, className = "", size = "normal", to = "/" }) => {
  return (
    <PostTitleStyles size={size} className={`post-title ${className}`}>
      <div className="mb-6">
        <NavLink to={to}>{children}</NavLink>
      </div>
    </PostTitleStyles>
  );
};

export default PostTitle;
