import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

function createPortalWrapper() {
  const element = document.createElement("div");
  element.id = "portal-wrapper";
  return element;
}

const portalWrapperElement = createPortalWrapper();

const Portal = ({
  containerClassName = "",
  bodyClassName = "",
  onClose = () => {},
  overlay = true,
  containerStyle = {},
  bodyStyle = {},
  children,
}) => {
  const renderPortal = (
    <div
      className={`fixed inset-0 ${containerClassName}`} // bo fixed se khac phuc duoc loi hover
      style={{ zIndex: 999999, ...containerStyle }}
    >
      <div
        className={`absolute inset-0 ${
          overlay ? "bg-black bg-opacity-25" : "invisible opacity-0"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`content relative ${bodyClassName}`}
        style={{ zIndex: 10, ...bodyStyle }}
      >
        {children}
      </div>
    </div>
  );

  useEffect(() => {
    document.body.appendChild(portalWrapperElement);
  }, []);
  return createPortal(renderPortal, portalWrapperElement);
};

Portal.propTypes = {
  containerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  onClose: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  containerStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  children: PropTypes.node,
  overlay: PropTypes.bool,
};

export default Portal;
