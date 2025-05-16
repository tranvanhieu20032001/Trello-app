import { useLocation, useRoutes, useMatch } from "react-router-dom";
import routes from "./routes";
import CardDetailsModal from "~/components/Modal/CardDetailsModal";
import Board from "~/pages/Boards";
import BoardWrapper from "~/pages/Boards/BoardWrapper";

function AppRoutesWrapper() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;
  const element = useRoutes(routes, backgroundLocation || location);

  // Kiểm tra có đang match route /card/:cardId không
  const matchCardRoute = useMatch("/card/:cardId");

  return (
    <>
      {element}
       {matchCardRoute && !state?.backgroundLocation && <Board />}
      {matchCardRoute && (
        <CardDetailsModal cardId={matchCardRoute.params.cardId} />
      )}
    </>
  );
}

export default AppRoutesWrapper;
