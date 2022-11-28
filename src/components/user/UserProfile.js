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
import BlindAuction from "../../contracts/BlindAuction.json"
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
      console.log(await getWeb3());
      const web3 = await getWeb3();
      console.log(web3);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork2 = BlindAuction.networks[networkId];
      const instance2 = await new web3.eth.Contract(
        BlindAuction.abi,
        deployedNetwork2 && deployedNetwork2.address
      );
      instance2.options.address = deployedNetwork2.address;
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
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="text-center mb-10">
          <div className="flex flex-row items-center justify-end">
            <div className="flex flex-row gap-x-3 mr-3">
              <Button onClick={handleConnect}>Connect MetaMask</Button>
              <Button
                isLoading={isSubmitting}
                disabled={isSubmitting}
                kind="primary"
                type="submit"
                className="mr-auto w-[200px]"
              >
                Update
              </Button>
            </div>
            <Button onClick={handleSignOut}>SignOut</Button>
          </div>
          <ImageUpload
            onChange={handleSelectImage}
            handleDeleteImg={handleDeleteImg}
            progress={progress}
            image={image}
            className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Full name</Label>
            <Input
              control={control}
              name="fullName"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>User name</Label>
            <Input
              control={control}
              name="userName"
              placeholder="Enter your username"
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
            <Label>Mobile Number</Label>
            <Input
              control={control}
              name="phone"
              placeholder="Enter your phone number"
            ></Input>
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"
            ></Input>
          </Field>
          <Field></Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>New Password</Label>
            <Input
              control={control}
              name="password"
              type="password"
              placeholder="Enter your password"
            ></Input>
          </Field>
          <Field>
            <Label>Confirm Password</Label>
            <Input
              control={control}
              name="confirmPassword"
              type="password"
              placeholder="Enter your confirm password"
            ></Input>
          </Field>
        </div>
        <div className="mx-32 mb-10">
          <Field>
            <Label>About you</Label>
            <TextAreaAutoReSize
              control={control}
              name="description"
              placeholder="About you"
            ></TextAreaAutoReSize>
          </Field>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
