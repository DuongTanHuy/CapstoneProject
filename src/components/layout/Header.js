import { Button } from "components/button";
import { Input } from "components/input";
import ModalAdvanced from "components/modal/ModalAdvanced";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const menuList = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/auction",
    title: "Auction",
  },
  {
    url: "/profile",
    title: "Profile",
  },
];

const HeaderStyles = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999999999;
  padding: 16px 0;
  background-color: white;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
  }
  .search {
    /* padding: 0px 26px; */
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 20px;
  }
  .search-input {
    flex: 1;
    outline: none;
    padding-right: 46px;
    font-weight: 500;
  }
  .search-icon {
    position: absolute;
    right: 16px;
  }
`;

// function getLastName(name) {
//   const length = name.split(" ").length;
//   return name.split(" ")[length - 1];
// }

const Header = () => {
  const { userInfo } = useAuth();
  const [hit, setHit] = useState(false);
  const [notify, setNotify] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [myAuction, setMyAuction] = useState([]);
  const [auctionParticipated, setAuctionParticipated] = useState([]);
  const date = notify?.createdAt?.seconds
    ? new Date(notify?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      search: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const colRef = collection(db, "notify");
    const queries = query(
      colRef, // set status (pending, apply...) tai day where("status","==", 1)
      where("userId", "==", userInfo?.uid ? userInfo.uid : "")
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setNotify(result);
    });
  }, [userInfo?.uid]);

  useEffect(() => {
    const colRef = collection(db, "participants");
    const queries = query(
      colRef, // set status (pending, apply...) tai day where("status","==", 1)
      where("userId", "==", userInfo?.uid ? userInfo.uid : "")
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setMyAuction(result);
    });
  }, [userInfo?.uid]);

  useEffect(() => {
    if (!myAuction) return;
    let data = [];
    async function fetchData(postId) {
      if (!postId) return;
      const colRef = doc(db, "posts", postId);
      const singleDoc = await getDoc(colRef);
      if (singleDoc.data()) {
        data = [...data, { ...singleDoc.data(), postId }];
        setAuctionParticipated(data);
      }
    }
    for (let i = 0; i < myAuction.length; i++) {
      fetchData(myAuction[i].postID);
    }
  }, [myAuction]);

  const handleSearch = (value) => {
    if (!isValid) return;
    setFilter(value.search);
  };

  useEffect(() => {
    if (filter) {
      setLoading(true);
      setTimeout(() => {
        const colRef = collection(db, "posts");
        const queries = query(
          colRef,
          where("title", ">=", filter),
          where("title", "<=", filter + "utf8")
        );
        onSnapshot(queries, (snapshot) => {
          let result = [];
          snapshot.forEach((doc) => {
            result.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setPosts(result);
          setLoading(false);
        });
      }, 1000);
    }
  }, [filter]);

  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to={"/"}>
            <img srcSet="/Logo.png 3x" alt="SmartTender" className="logo" />
          </NavLink>
          <ul className="menu">
            {menuList.map((item) => (
              <li className="menu-item" key={item.title}>
                {item.title === "Profile" ? (
                  <NavLink
                    to={item.url + `?id=${userInfo?.uid}`}
                    id="menu-link"
                    className={({ isActive }) =>
                      isActive ? "border-b-4 border-violet-600" : ""
                    }
                  >
                    {item.title}
                  </NavLink>
                ) : (
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      isActive ? "border-b-4 border-violet-600" : ""
                    }
                    id="menu-link"
                  >
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className="relative ml-auto mr-9">
            {userInfo && (
              <div className="absolute top-1/2 -left-9">
                <ModalAdvanced
                  effect="list-transition"
                  visible={openModal}
                  onClose={() => setOpenModal(false)}
                >
                  <div className="content bg-half-transparent w-full fixed nav-item top-[92px] right-0 ">
                    <div className="float-right h-screen  duration-1000 ease-in-out dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white md:w-400 p-8">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg">
                          Auction participated
                        </p>
                        <span
                          className="cursor-pointer p-2 rounded-full hover:shadow-lg"
                          onClick={() => setOpenModal(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                      </div>
                      {auctionParticipated?.map((auction, index) => (
                        <div
                          className="cursor-pointer"
                          key={index}
                          onClick={() =>
                            navigate(`${auction.slug}?id=${auction.postId}`)
                          }
                        >
                          <div>
                            <div className="flex items-center   leading-8 gap-5 border-b-1 border-color dark:border-gray-600 p-4">
                              <img
                                className="rounded-lg h-24 w-24"
                                src={auction.image}
                                alt=""
                              />
                              <div>
                                <p className="font-semibold ">
                                  {auction.title}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                                  {auction.author}
                                </p>
                                <div className="flex gap-4 mt-2 items-center">
                                  <p id="unitPrice">
                                    {Number(auction.startPrice).toLocaleString(
                                      "it-IT",
                                      {
                                        style: "currency",
                                        currency: "VND",
                                      }
                                    )}
                                  </p>
                                  <div className="flex items-center border-1 border-r-0 border-color rounded">
                                    <p className="p-2 border-r-1 dark:border-gray-600 border-color text-red-600 "></p>
                                    {/* <p className="p-2 border-r-1 border-color dark:border-gray-600 text-green-600">
                                      VND
                                    </p> */}
                                    <p className="p-2 border-r-1 border-color dark:border-gray-600 text-green-600"></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 mb-3">
                        <div className="flex justify-between items-center">
                          {/* <p className="text-gray-500 dark:text-gray-200">
                            Sub Total
                          </p>
                          <p className="font-semibold">$890</p> */}
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-gray-500 dark:text-gray-200 font-bold">
                            Total
                          </p>
                          <p className="font-semibold">
                            {Number(8900000).toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalAdvanced>
                <div className="cursor-pointer absolute top-1/2 -left-14 -translate-y-1/2 z-10">
                  <li className="list-none flex items-center justify-center">
                    <div className="flex flex-row gap-x-4 justify-center items-center">
                      <span onClick={() => setOpenModal(true)}>
                        <img
                          className="scale-[126%]"
                          src="/auction.png"
                          alt=""
                        />
                      </span>

                      <span onClick={() => setHit(true)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                          />
                        </svg>
                      </span>
                    </div>

                    <div
                      onMouseLeave={() => setHit(false)}
                      className={`transition-all shadow-2xl rounded-lg min-w-[440px] bg-white ${
                        hit ? "absolute top-12" : "absolute top-12 donShow"
                      }`}
                    >
                      <ul>
                        <li className="text-[28px] p-3 rounded-lg rounded-b-none flex flex-row items-center">
                          <h6 className="pt-1">Notifications</h6>
                          <span
                            className="p-1 rounded-full hover:shadow-lg ml-auto"
                            onClick={() => setHit(false)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-9 h-9"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                        </li>
                        {notify.length > 0 &&
                          notify.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col gap-y-2 mt-2 hover:opacity-60"
                            >
                              <li className="px-6 rounded-lg rounded-t-none">
                                {item.status === 1 ? (
                                  <div
                                    className="flex flex-row gap-x-3 items-center"
                                    onClick={() =>
                                      navigate(
                                        `${item?.slug}?id=${item?.postId}`
                                      )
                                    }
                                  >
                                    <div className=" w-[50px] h-[50px] rounded-full overflow-hidden">
                                      <img
                                        className="w-full h-full object-cover"
                                        src={
                                          item.image ||
                                          "https://images.unsplash.com/photo-1670272499188-79fe22656f64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                                        }
                                        alt=""
                                      />
                                    </div>
                                    <div className="text-gray-500 flex flex-col">
                                      <span className="font-semibold">
                                        {`${item.content}   `}
                                      </span>
                                      <div className="grid grid-cols-2 gap-x-3">
                                        <span className="flex flex-row">
                                          Status:{" "}
                                          <span className="text-green-500 flex flex-row items-center justify-center">
                                            accepted
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth="1.5"
                                              stroke="currentColor"
                                              className="w-6 h-6 inline-block text-green-500"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                              />
                                            </svg>
                                          </span>
                                        </span>
                                        <span className="text-gray-300">
                                          {`Date: ${formatDate}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="flex flex-row gap-x-3 items-center"
                                    onClick={() =>
                                      navigate(
                                        `${item?.slug}?id=${item?.postId}`
                                      )
                                    }
                                  >
                                    <div className=" w-[50px] h-[50px] rounded-full overflow-hidden">
                                      <img
                                        className="w-full h-full object-cover"
                                        src={
                                          item.image ||
                                          "https://images.unsplash.com/photo-1670272499188-79fe22656f64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                                        }
                                        alt=""
                                      />
                                    </div>
                                    <div className="text-gray-500 flex flex-col">
                                      <span className="font-semibold">
                                        {`${item.content}   `}
                                      </span>
                                      <div className="grid grid-cols-2 gap-x-3">
                                        <span className="flex flex-row">
                                          Status:{" "}
                                          <span className="text-red-500 flex flex-row items-center justify-center">
                                            rejected
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth="1.5"
                                              stroke="currentColor"
                                              className="w-6 h-6 inline-block text-red-500"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </span>
                                        </span>
                                        <span className="text-gray-300">
                                          {`Date: ${formatDate}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </li>
                              <hr />
                            </div>
                          ))}
                      </ul>
                    </div>
                  </li>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit(handleSearch)} className="search">
              {/* <input type="text" className="search-input" placeholder="Search" /> */}
              <Input
                className="min-w-[290px]"
                name="search"
                control={control}
                placeholder="Search"
              ></Input>
              <span className="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-[#292D32]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </span>
            </form>
            <div
              onMouseLeave={() => {
                setPosts([]);
              }}
              className="bg-white rounded-lg shadow-lg absolute min-w-[374px] flex flex-col gap-y-1 p-1"
            >
              {loading && (
                <div className="mx-auto my-3 loading w-8 h-8 rounded-full border-primary border-4 border-r-4 border-r-transparent animate-spin"></div>
              )}
              {!loading &&
                posts.length > 0 &&
                posts.map((post) => (
                  <div
                    onClick={() => {
                      navigate(`${post.slug}?id=${post.id}`);
                      setPosts([]);
                      reset();
                    }}
                    key={post.id}
                    className="flex flex-row gap-x-3 justify-start items-center cursor-pointer hover:opacity-60"
                  >
                    <div>
                      <div className="flex items-center gap-x-3">
                        <img
                          src={post.image}
                          alt=""
                          className="w-[66px] h-[55px] rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{post.title}</h3>
                          <time className="text-sm text-gray-500">
                            <span>Date: </span>
                            {new Date(
                              post.createdAt.seconds * 1000
                            ).toLocaleDateString("vi-VI")}
                          </time>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-[100px]">{post.author}</div>
                  </div>
                ))}
            </div>
          </div>

          {!userInfo ? (
            <Button
              type="button"
              height="58px"
              className="header-button"
              to="/sign-in"
            >
              Sign In
            </Button>
          ) : (
            <div className="header-auth flex flex-col items-center justify-center">
              <span>Welcome back! </span>
              <strong className="text-primary">{userInfo?.displayName}</strong>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
