import { Button } from "components/button";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import DashboardHeading from "components/module/dashboard/DashboardHeading";
import TextAreaAutoReSize from "components/textarea/TextAreaAutoReSize";
import { useAuth } from "contexts/auth-context";
import { auth, db } from "firebase-app/firebase-config";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useHandleImage from "hooks/useHandleImage";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import Web3 from "web3";
// import BlindAuction from "../../contracts/BlindAuction.json";

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

  const handleConnect = async () => {
    // const web3 = new Web3(window.ethereum);
    // const init = async () => {
    //   if (this.state.initialised === false) return;
    //   const { blind_contract, market, web3 } = this.state;
    //   const accounts = await web3.eth.getAccounts();
    //   this.setState({ accounts });
    //   const response = await web3.eth.getBalance(accounts[0]);
    //   // Update state with the result.
    //   this.eventcheck(market, blind_contract);
    //   console.log(response);
    // };

    // try {
    //   if (window.ethereum) {
    //     // Do something
    //   } else {
    //     alert("install metamask extension!!");
    //   }
    //   const accounts = window.ethereum
    //     .request({ method: "eth_requestAccounts" })
    //     .then((res) => {
    //       // Return the address of the wallet
    //       console.log(res);
    //     });

    //   const networkId = await web3.eth.net.getId();
    //   const deployedNetwork2 = BlindAuction.networks[networkId];
    //   const instance2 = await new web3.eth.Contract(
    //     BlindAuction.abi,
    //     deployedNetwork2 && deployedNetwork2.address
    //   );
    //   instance2.options.address = deployedNetwork2.address;
    //   //console.log(instance2);
    //   init();
    //   this.setState(
    //     {
    //       web3,
    //       accounts,
    //       blind_contract: instance2,

    //       initialised: true,
    //       currentAccount: accounts[0],
    //     },
    //     this.init
    //   );
    // } catch (e) {
    //   console.log(`Error: ${e.message}`);
    // }
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
        <Field>
          <Label>About your</Label>
          <TextAreaAutoReSize
            control={control}
            name="description"
            placeholder="About you"
          ></TextAreaAutoReSize>
        </Field>
      </form>
    </div>
  );
};

export default UserProfile;
