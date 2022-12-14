import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const Modal = ({ open = false, handleClose = () => {} }) => {
  const forms = useForm();
  const onSubmit = (values) => {
    console.log(values);
    forms.reset();
  };
  if (typeof document === "undefined") return <div className="modal"></div>;
  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 modal ${
        !open ? "opacity-0 invisible" : ""
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-25 overlay"
        onClick={handleClose}
      ></div>
      <form className="content bg-white relative z-10 rounded-lg p-10 max-w-[482px]">
        <div
          onClick={handleClose}
          className="absolute w-8 h-8 rounded-full shadow-lg cursor-pointer -top-[10px] -right-[10px] bg-white flex items-center justify-center p-1"
        >
          <svg
            className="opacity-50"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.225 7L13.7375 1.4875C14.0875 1.1375 14.0875 0.6125 13.7375 0.2625C13.3875 -0.0875 12.8625 -0.0875 12.5125 0.2625L7 5.775L1.4875 0.2625C1.1375 -0.0875 0.6125 -0.0875 0.2625 0.2625C-0.0874998 0.6125 -0.0874998 1.1375 0.2625 1.4875L5.775 7L0.2625 12.5125C0.0875002 12.6875 0 12.8625 0 13.125C0 13.65 0.35 14 0.875 14C1.1375 14 1.3125 13.9125 1.4875 13.7375L7 8.225L12.5125 13.7375C12.6875 13.9125 12.8625 14 13.125 14C13.3875 14 13.5625 13.9125 13.7375 13.7375C14.0875 13.3875 14.0875 12.8625 13.7375 12.5125L8.225 7Z"
              fill="#84878B"
            />
          </svg>
        </div>
        <p className="mb-6 text-4xl font-semibold text-center text-black">
          Welcome Back!
        </p>
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="text-sm cursor-pointer">
            Email address
          </label>
          <input
            className="w-full text-sm leading-normal bg-[#e7ecf3] p-4 mb-5 rounded-lg border-[2px] transition-none focus:border-[#8334cc]"
            type="email"
            id="email"
            placeholder="Enter your email address"
            {...forms.register("email")}
          />

          <label htmlFor="password" className="text-sm cursor-pointer">
            Password
          </label>
          <input
            className="w-full text-sm leading-normal bg-[#e7ecf3] p-4 mb-5 rounded-lg border-[2px] transition-none focus:border-[#8334cc]"
            type="password"
            id="password"
            placeholder="Enter your password"
            {...forms.register("password")}
          />
        </div>
        <button
          onClick={forms.handleSubmit(onSubmit)}
          className="bg-[#8334cc] w-full p-3 rounded-lg text-white font-semibold"
        >
          Sign In
        </button>
      </form>
    </div>,
    document.querySelector("body")
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Modal;
