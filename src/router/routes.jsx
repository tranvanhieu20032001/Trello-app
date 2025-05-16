import Login from "~/pages/Login";
import NotFound from "~/pages/NotFound";
import Register from "~/pages/Register";
import Home from "~/pages/Home";
import HomeSection from "~/components/Home/Section/HomeSection";
import WorkSpace from "~/pages/Workspace/WorkSpace";
import MemberContent from "~/components/Workspace/Content/MemberContent";
import BoardsContent from "~/components/Workspace/Content/BoardsContent";
import Board from "~/pages/Boards";
import BoardWrapper from "~/pages/Boards/BoardWrapper";
import InvitePage from "~/pages/InvitePage";
import GoogleCallBack from "~/components/GoogleCallBack";
import ImageUnSplash from "~/components/ImageUnSplash";
import CardDetailsModal from "~/components/Modal/CardDetailsModal";
import App from "~/App";
import ProtectedRoute from "./ProtectedRoute";
import BoardsSection from "~/components/Home/Section/BoardsSection";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
            children: [{ path: "/", element: <HomeSection /> },
              { path: "/boards", element: <BoardsSection /> }
            ],
          },
          {
            path: "workspace/",
            element: <WorkSpace />,
            children: [
              { path: ":id/", element: <BoardsContent /> },
              { path: ":id/members", element: <MemberContent /> },
            ],
          },
          {
            path: "board/",
            element: <BoardWrapper />,
            children: [{ path: ":boardId", element: <Board /> }],
          },
          {
            path: "card/:cardId",
            element: <CardDetailsModal />,
          },
          {
            path: "invite/wp/:token",
            element: <InvitePage />,
          },
          {
            path: "invite/b/:token",
            element: <InvitePage />,
          },
        ],
      },
      { path: "callback", element: <GoogleCallBack /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "images", element: <ImageUnSplash /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
