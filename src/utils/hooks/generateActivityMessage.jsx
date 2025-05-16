export function generateActivityMessage(action, data) {
  switch (action) {
    case "CARD_CREATED":
      return (
        <>
          added this card to{" "}
          <span className="font-semibold">{data?.columnTitle}</span>
        </>
      );

    case "JOINED_CARD":
      return <>joined this card</>;

    case "LEAVED_CARD":
      return <>left this card</>;

    case "ADD_MEMBER":
      return (
        <>
          added member <span className="font-semibold">{data?.memberName}</span>{" "}
          to this card
        </>
      );

    case "COMPLETE_CARD":
      return <>marked this card as complete</>;

    case "INCOMPLETE_CARD":
      return <>marked this card as incomplete</>;

    case "UPLOAD_ATTACHMENT":
      return (
        <>
          attached <span className="font-semibold">{data?.fileName}</span> to
          this card
        </>
      );

    case "DELETE_ATTACHMENT":
      return (
        <>
          deleted <span className="font-semibold">{data?.fileName}</span> from
          this card
        </>
      );

    default:
      return <>performed an action</>;
  }
}
