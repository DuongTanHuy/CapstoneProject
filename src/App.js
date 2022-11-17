import Layout from "components/layout/Layout";
import DashboardLayout from "components/module/dashboard/DashboardLayout";
import PostAddNew from "components/module/post/PostAddNew";
import PostManage from "components/module/post/PostManage";
import AuctionPage from "pages/AuctionPage";
import DashboardPage from "pages/DashboardPage";
import HomePage from "pages/HomePage";
import NotFoundPage from "pages/NotFoundPage";
import PostDetailsPage from "pages/PostDetailsPage";
import SignInPage from "pages/SignInPage";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
          {/* <Route path="/auction" element={<AuctionPage></AuctionPage>}></Route> */}

          <Route element={<Layout></Layout>}>
            <Route
              path="/auction"
              element={<AuctionPage></AuctionPage>}
            ></Route>
            <Route
              path="/auction/create-auction"
              element={<PostAddNew></PostAddNew>}
            ></Route>
          </Route>

          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>

          <Route
            path="/:slug"
            element={<PostDetailsPage></PostDetailsPage>}
          ></Route>

          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            ></Route>
            <Route
              path="/manage/pending"
              element={<PostManage></PostManage>}
            ></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
