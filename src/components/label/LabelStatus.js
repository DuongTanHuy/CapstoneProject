import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const LabelStatusStyles = styled.span`
  display: inline-block;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;
/**
 *
 * @param type - "un-approved" "approved" "pending"
 * @returns
 */
const LabelStatus = ({ children, type = "pending" }) => {
  let styleClassName = "text-gray-500 bg-gray-100";
  switch (type) {
    case "approved":
      styleClassName = "text-green-500 bg-green-100";
      break;
    case "pending":
      styleClassName = "text-orange-500 bg-orange-100";
      break;
    case "un-approved":
      styleClassName = "text-red-500 bg-red-100";
      break;

    default:
      break;
  }
  return (
    <LabelStatusStyles className={styleClassName}>{children}</LabelStatusStyles>
  );
};
LabelStatus.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(["pending", "un-approved", "approved"]).isRequired,
};
export default LabelStatus;
