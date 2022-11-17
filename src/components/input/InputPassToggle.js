import { IconEyeClose, IconEyeOpen } from "icon";
import React, { Fragment, useState } from "react";
import Input from "./Input";

const InputPassToggle = ({ control, name='password' }) => {
  const [togglePass, setTogglePass] = useState(false);

  if (!control) return null;

  return (
    <Fragment>
      <Input
        name={name}
        type={`${togglePass ? "text" : "password"}`}
        placeholder="Enter your password"
        control={control}
      >
        {!togglePass ? (
          <IconEyeClose onClick={() => setTogglePass(true)}></IconEyeClose>
        ) : (
          <IconEyeOpen onClick={() => setTogglePass(false)}></IconEyeOpen>
        )}
      </Input>
    </Fragment>
  );
};

export default InputPassToggle;
