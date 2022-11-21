import { ActionDelete, ActionEdit, ActionView } from "components/actions";
import { Button } from "components/button";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { postStatus } from "untils/constants";
import lodash from "lodash";
import DashboardHeading from "components/module/dashboard/DashboardHeading";

const POSTS_PER_PAGE = 5;

const AuctionPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
      toast.warn("You must be logged in to use this function!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newQueries = query(
        colRef,
        where("userId", "==", userInfo?.uid ? userInfo.uid : "")
      );
      const queries = filter
        ? query(
            colRef,
            where("userId", "==", userInfo?.uid ? userInfo.uid : ""),
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
          )
        : query(
            colRef,
            where("userId", "==", userInfo?.uid ? userInfo.uid : ""),
            limit(POSTS_PER_PAGE)
          );

      const documentSnapshots = await getDocs(queries);

      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(newQueries, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(queries, (snapshot) => {
        let result = [];

        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(result);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter, userInfo?.uid]);

  const handleDeletePost = async (post) => {
    if (post.status === 1) {
      toast.warn("Unable to delete because your bid has been approved!");
      return;
    }
    const colRef = doc(db, "posts", post?.id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleEdit = (post) => {
    if (post.status === 1) {
      toast.warn("Unable to update because your bid has been approved!");
      return;
    }
    navigate(`/auction/update-auction?id=${post.id}`);
  };

  const handleFilterChange = lodash.debounce(
    (event) => setFilter(event.target.value),
    1000
  );

  const handleLoadMorePost = async () => {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
      collection(db, "posts"),
      startAfter(lastDoc),
      limit(POSTS_PER_PAGE)
    );

    onSnapshot(next, (snapshot) => {
      let result = [];

      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts([...posts, ...result]);
    });
    const documentSnapshots = await getDocs(next);

    // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };

  return (
    <div>
      <DashboardHeading
        title="My Auction"
        desc="Manage your auction list"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end">
        <div className="flex flex-row w-full max-w-[400px] gap-5">
          <input
            onChange={handleFilterChange}
            type="text"
            className="w-full p-4 rounded-lg border-2 border-solid border-gray-300 outline-none focus:border-primary"
            placeholder="Search post..."
          />
          <Button to="/auction/create-auction" className="min-w-[170px]">
            Create auction
          </Button>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tender</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts &&
            posts.length > 0 &&
            posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id.slice(0, 3)}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={post.image}
                      alt=""
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{post.title}</h3>
                      <time className="text-sm text-gray-500"><span>Date: </span>
                        {new Date(
                          post.createdAt.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">
                    {post.categoryId === "1EfE0RTX3XSna0daNiz9"
                      ? "Secret Auction"
                      : "Public Auction"}
                  </span>
                </td>
                <td>
                  <span className="text-gray-500">{post.author}</span>
                </td>
                <td>
                  {post.status === postStatus.APPROVED && (
                    <LabelStatus type="approved">Approved</LabelStatus>
                  )}
                  {post.status === postStatus.REJECTED && (
                    <LabelStatus type="un-approved">Un-approved</LabelStatus>
                  )}
                  {post.status === postStatus.PENDING && (
                    <LabelStatus type="pending">Pending</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView></ActionView>
                    <ActionEdit onClick={() => handleEdit(post)}></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeletePost(post)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div className="mt-10">
        {/* <Pagination></Pagination> */}
        {total > posts.length && (
          <Button className="mx-auto" onClick={handleLoadMorePost}>
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
