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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UserProfile = () => {
  const [params] = useSearchParams();
  const userId = params.get("id");
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
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
      console.log(accounts)
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
  };

  return (
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
            <p className="text-2xl font-semibold ">Your Account</p>
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
            <Input
              control={control}
              name="password"
              type="password"
              placeholder="Enter your password"
            ></Input>
            <Button kind="secondary" className="hover:opacity-60 shadow-xl">
              Change password
            </Button>
          </div>
          <div className="children bg-white shadow-2xl rounded-lg p-9">
            <div className="flex flex-row items-center justify-center mb-5">
              <p className="text-2xl font-semibold">Update your profile</p>
              <Button
                isLoading={isSubmitting}
                disabled={isSubmitting}
                kind="secondary"
                type="submit"
                className="ml-auto w-[160px] max-h-[32px] shadow-xl hover:opacity-60"
              >
                Update
              </Button>
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
                <Label>Mobile Number</Label>
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
