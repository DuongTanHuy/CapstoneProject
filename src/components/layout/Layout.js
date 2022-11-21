import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";

const LayoutStyles = styled.div`
  /* max-width: 1600px; */
  /* margin: 0 auto; */
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 25px;
      margin-bottom: 5px;
      color: ${(props) => props.theme.primary};
    }
    &-short-desc {
      font-size: 14px;
      color: ${(props) => props.theme.gray80};
    }
    &-create-auction-layout {
      padding: 0 60px;
    }
  }
`;

const Layout = ({ children }) => {
  return (
    <Fragment>
      <LayoutStyles>
        <div className="dashboard-create-auction-layout">
          <Header></Header>
          {children}
          <Outlet></Outlet>
        </div>
      </LayoutStyles>
    </Fragment>
  );
};

export default Layout;
