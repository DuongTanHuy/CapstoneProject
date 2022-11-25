import Layout from "components/layout/Layout";
import DashboardLayout from "components/module/dashboard/DashboardLayout";
import PostAddNew from "components/module/post/PostAddNew";
import PostManage from "components/module/post/PostManage";
import PostUpdate from "components/module/post/PostUpdate";
import UserManage from "components/user/UserManage";
import UserProfile from "components/user/UserProfile";
import CreateAuctions from "mainFunctions/CreateAuction";
import AuctionPage from "pages/AuctionPage";
import DashboardPage from "pages/DashboardPage";
import HomePage from "pages/HomePage";
import ManagePostUpdate from "pages/ManagePostUpdate";
import NotFoundPage from "pages/NotFoundPage";
import PostDetailsPage from "pages/PostDetailsPage";
import SignInPage from "pages/SignInPage";
import { Route, Routes } from "react-router-dom";
// import { useEffect } from "react";
import { useAuth } from "./contexts/auth-context";
import SignUpPage from "./pages/SignUpPage";

function SubApp() {
  const userInfo = useAuth();
  const authenticatedUser = userInfo?.userInfo?.email === "admin@gmail.com";

  return (
    <>
      <Routes>
        <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
        <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>

        {authenticatedUser ? (
          <>
            <Route path="/" element={<DashboardLayout></DashboardLayout>}>
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              ></Route>
              <Route
                path="/manage/pending"
                element={<PostManage></PostManage>}
              ></Route>
              <Route
                path="/auction/update-auction"
                element={<ManagePostUpdate></ManagePostUpdate>}
              ></Route>
              <Route
                path="/auction/details"
                element={<PostDetailsPage></PostDetailsPage>}
              ></Route>
              <Route
                path="/manage/user"
                element={<UserManage></UserManage>}
              ></Route>
            </Route>
            <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route element={<Layout></Layout>}>
              <Route
                path="/auction"
                element={<AuctionPage></AuctionPage>}
              ></Route>
              <Route
                path="/create"
                element={<CreateAuctions></CreateAuctions>}
              ></Route>
              <Route
                path="/auction/create-auction"
                element={<PostAddNew></PostAddNew>}
              ></Route>
              <Route
                path="/auction/update-auction"
                element={<PostUpdate></PostUpdate>}
              ></Route>
              <Route
                path="/profile"
                element={<UserProfile></UserProfile>}
              ></Route>
              <Route
                path="/:slug"
                element={<PostDetailsPage></PostDetailsPage>}
              ></Route>
            </Route>

            <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
          </>
        )}
      </Routes>
    </>
  );
}

export default SubApp;
