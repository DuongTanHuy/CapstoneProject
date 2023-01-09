import { Button } from "components/button";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import DashboardHeading from "components/module/dashboard/DashboardHeading";
import TextAreaAutoReSize from "components/textarea/TextAreaAutoReSize";
import { useAuth } from "contexts/auth-context";
import { useMeta } from "contexts/metamask-context";
import { auth, db } from "firebase-app/firebase-config";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import getWeb3 from "getWeb3";
import BlindAuction from "../../contracts/BlindAuction.json";
import useHandleImage from "hooks/useHandleImage";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalAdvanced from "components/modal/ModalAdvanced";
import InputPassToggle from "components/input/InputPassToggle";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  newPass: yup
    .string()
    .min(8, "Your password must be at least 8 characters!")
    .matches(/(?=.*?[A-Z])/, "Password must contain at least one uppercase.")
    .matches(
      /(?=.*?[a-z])/,
      "Password must contain at least one lowercase letter."
    )
    .matches(/(?=.*?[0-9])/, "Password must contain at least one number.")
    .matches(
      /(?=.*?[#?!@$%^&*-])/,
      "Password must contain at least one special character."
    )
    .required("Please enter your password!"),
});

const UserProfile = () => {
  const [params] = useSearchParams();
  const userId = params.get("id");
  const { userInfo } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      avatar: "",
      createAt: "",
      email: "",
      fullName: "",
      password: "",
      birth: "",
      userName: "",
      phone: "",
      createdAt: "",
      role: "",
      status: "",
      imageName: "",
      description: "",
    },
  });

  const { image, setImage, progress, handleSelectImage, handleDeleteImg } =
    useHandleImage(setValue, getValues);

  window.document.body.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        delay: 0,
        pauseOnHover: false,
        // draggableDirection: "y",
      });
    }
  }, [errors]);

  const handleUpdate = (values) => {
    if (!isValid) return;

    const colRef = doc(db, "users", userId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(colRef, {
          avatar: image,
          email: values.email,
          userName: values.userName,
          fullName: values.fullName,
          birth: values.birth,
          identify: values.identify,
          phone: values.phone,
          imageName: values.imageName,
          description: values.description,
        });

        Swal.fire("Updated!", "Your file has been update.", "success");
      }
    });
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "users", userId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
      setImage(singleDoc.data().avatar);
    }

    fetchData();
  }, [reset, setImage, userId]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
      toast.warn("You must be logged in to use this function!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  const {
    web3,
    initialized,
    setInit,
    setWeb3,
    setAccounts,
    setCurrentAccounts,
    setBlindContract,
  } = useMeta();

  const handleConnect = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork2 = BlindAuction.networks[networkId];
      const instance2 = await new web3.eth.Contract(
        BlindAuction.abi,
        deployedNetwork2 && deployedNetwork2?.address
      );
      instance2.options.address = deployedNetwork2?.address;

      setWeb3(web3);
      setAccounts(accounts);
      setBlindContract(instance2);
      setInit(true);
      setCurrentAccounts(accounts[0]);
      init();
    } catch (error) {
      console.error(error);
    }
  };

  const init = async () => {
    if (initialized === false) return;
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts);
    toast.success("Successful connection!");
  };

  const handleChangePass = (values) => {
    if (!isValid) return;
    if (values.oldPass !== values.password) {
      toast.error("Wrong old password!");
      return;
    }
    if (values.newPass !== values.confNewPass) {
      toast.error("Confirm incorrect password!");
      return;
    }

    const colRef = doc(db, "users", userId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(colRef, {
          password: values.newPass,
        });
        Swal.fire("Updated!", "Your file has been update.", "success");
      }
    });
  };

  return (
    <Fragment>
      <ModalAdvanced visible={openModal} onClose={() => setOpenModal(false)}>
        <form
          className="content bg-white relative z-10 rounded-lg p-10 max-w-[482px]"
          onSubmit={handleSubmit(handleChangePass)}
        >
          <div
            onClick={() => setOpenModal(false)}
            className="absolute w-8 h-8 rounded-full shadow-lg cursor-pointer -top-[10px] -right-[10px] bg-white flex items-center justify-center p-1"
          >
            <svg
              className="hover:opacity-50"
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
            Change your password
          </p>
          <hr className="bg-gray-200" />
          <div className="flex flex-col gap-y-3">
            <Label className="mt-6">Old password</Label>
            <Input
              control={control}
              name="oldPass"
              placeholder="Enter your old password"
            ></Input>
            <Label className="mt-6">New password</Label>
            <Input
              control={control}
              name="newPass"
              placeholder="Enter your new password"
            ></Input>
            <Label className="mt-6">Confirm new password</Label>
            <Input
              control={control}
              name="confNewPass"
              placeholder="Confirm your new password"
            ></Input>
            <button className="bg-[#8334cc] w-full p-3 rounded-lg text-white font-semibold mt-6">
              Confirm
            </button>
          </div>
        </form>
      </ModalAdvanced>
      <div>
        <div>
          <DashboardHeading
            title="Account information"
            desc="Update your account information"
          ></DashboardHeading>
          <div className="text-center ml-auto">
            <div className="flex flex-row gap-x-6 items-center justify-end mb-10">
              <Button onClick={handleConnect}>Connect MetaMask</Button>
              <Button onClick={handleSignOut}>SignOut</Button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div id="main">
            <div className="sideBar flex flex-col justify-center items-center gap-y-5 mb-5 p-9 w-[400px] bg-white shadow-2xl rounded-xl">
              <p className="text-2xl font-semibold ">My Account</p>
              <hr className="w-full bg-gray-300" />
              <ImageUpload
                onChange={handleSelectImage}
                handleDeleteImg={handleDeleteImg}
                progress={progress}
                image={image}
                className="w-[100px] h-[100px] !rounded-full min-h-0 mx-auto"
              ></ImageUpload>
              <Label className="mr-auto">User name</Label>
              <Input
                control={control}
                name="userName"
                placeholder="Enter your username"
              ></Input>
              <Label className="mr-auto">Email</Label>
              <Input
                control={control}
                name="email"
                type="email"
                placeholder="Enter your email address"
              ></Input>
              <Label className="mr-auto">Password</Label>
              <InputPassToggle control={control}></InputPassToggle>
              <Button
                kind="primary"
                className="hover:opacity-60 shadow-xl mt-6"
                onClick={() => setOpenModal(true)}
              >
                Change password
              </Button>
            </div>
            <div className="children bg-white shadow-2xl rounded-lg p-9">
              <div className="flex flex-row items-center justify-center mb-5">
                <p className="text-center text-2xl font-semibold">My Profile</p>
                {/* <Button
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  kind="secondary"
                  type="submit"
                  className="ml-auto w-[160px] max-h-[32px] shadow-xl hover:opacity-60"
                >
                  Update
                </Button> */}
              </div>
              <hr className="w-full bg-gray-300 mb-5" />
              <div className="form-layout">
                <Field>
                  <Label>Full name</Label>
                  <Input
                    control={control}
                    name="fullName"
                    placeholder="Enter your full name"
                  ></Input>
                </Field>
                <Field>
                  <Label>Identify card</Label>
                  <Input
                    control={control}
                    name="identify"
                    placeholder="Enter your identify card"
                  ></Input>
                </Field>
              </div>
              <div className="form-layout">
                <Field>
                  <Label>Date of Birth</Label>
                  <Input
                    control={control}
                    name="birth"
                    placeholder="dd/mm/yyyy"
                  ></Input>
                </Field>
                <Field>
                  <Label>Phone Numbers</Label>
                  <Input
                    control={control}
                    name="phone"
                    placeholder="Enter your phone number"
                  ></Input>
                </Field>
              </div>
              <div className="mx-10 mb-10">
                <Field>
                  <Label>About me</Label>
                  <TextAreaAutoReSize
                    className="min-h-[110px]"
                    control={control}
                    name="description"
                    placeholder="About you"
                  ></TextAreaAutoReSize>
                </Field>
              </div>
              <Button
                isLoading={isSubmitting}
                disabled={isSubmitting}
                kind="primary"
                type="submit"
                className="mx-auto w-[200px] max-h-[60px] shadow-xl hover:opacity-60"
              >
                Update My Profile
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default UserProfile;
