export function generateNotificationsMessage(type, data) {
  switch (type) {
    case "TAGGED_IN_COMMENT":
      return <>tagged you in a comment</>;

    case "ADDED_TO_CARD":
      return (
        <>
          added you to the card{" "}
          <span className="font-semibold">{data?.cardName}</span>
        </>
      );

    case "REMOVED_FROM_CARD":
      return (
        <>
          removed you from the card{" "}
          <span className="font-semibold">{data?.cardName}</span>
        </>
      );

    case "COMPLETE_CARD":
      return (
        <>
          marked the card{" "}
          <span className="font-semibold">{data?.cardName}</span> as complete
        </>
      );

    case "INCOMPLETE_CARD":
      return (
        <>
          marked the card{" "}
          <span className="font-semibold">{data?.cardName}</span> as incomplete
        </>
      );

    case "ADDED_TO_BOARD":
      return (
        <>
          added you to the board{" "}
          <span className="font-semibold">{data?.boardName}</span>
        </>
      );
    case "REMOVE_FROM_BOARD":
      return (
        <>
          removed you from the board{" "}
          <span className="font-semibold">{data?.boardName}</span>
        </>
      );

    case "ADDED_TO_WORKSPACE":
      return (
        <>
          added you to the workspace{" "}
          <span className="font-semibold">{data?.workSpaceName}</span>
        </>
      );
    case "REMOVE_FROM_WORKSPACE":
      return (
        <>
          removed you from the workspace{" "}
          <span className="font-semibold">{data?.workSpaceName}</span>
        </>
      );
    default:
      return <>performed an action</>;
  }
}
