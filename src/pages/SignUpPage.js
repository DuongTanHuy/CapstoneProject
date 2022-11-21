import { Input } from "components/input";
import { Label } from "components/label";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Field } from "components/field";
import { Button } from "components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import InputPassToggle from "components/input/InputPassToggle";
import slugify from "slugify";
import { userRole, userStatus } from "untils/constants";

const schema = yup.object({
  fullName: yup.string().required("Please enter your full name!"),
  email: yup
    .string()
    .email("Please enter valid email address!")
    .required("Please enter your email address!"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters!")
    .required("Please enter your password!"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleSignUp = async (values) => {
    if (!isValid) return;
    if (values.password !== values.confirmPass) {
      toast.error("Confirm incorrect password!");
      return;
    }

    await createUserWithEmailAndPassword(auth, values.email, values.password);

    // const user = await createUserWithEmailAndPassword(
    //   auth,
    //   values.email,
    //   values.password
    // );

    await updateProfile(auth.currentUser, {
      displayName: values.fullName,
    });
    // const colRef = collection(db, "users");

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      userName: slugify(values.userName || values.fullName, {
        lower: true,
        replacement: " ",
        trim: true,
      }),
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createAt: serverTimestamp(),
    });

    // await addDoc(colRef, {
    //   fullName: values.fullName,
    //   email: values.email,
    //   password: values.password,
    // });
    toast.success("Register successfully!");
    navigate("/");
  };

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        delay: 0,
      });
    }
  }, [errors]);

  return (
    <AuthenticationPage>
      <form
        className="form"
        onSubmit={handleSubmit(handleSignUp)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            control={control}
          />
        </Field>

        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email address"
            control={control}
          />
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPassToggle control={control}></InputPassToggle>
        </Field>

        <Field>
          <Label htmlFor="confirmPass">Confirm password</Label>
          <InputPassToggle
            control={control}
            name="confirmPass"
          ></InputPassToggle>
        </Field>

        <div className="have-account">
          Already have an account? <NavLink to={"/sign-in"}>Sign In</NavLink>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
