export function generateActivityMessage(action, data) {
  switch (action) {
    case "CARD_CREATED":
      return `add this card to "${data.columnTitle}"`;
    case "JOINED_CARD":
      return `joined this card`;

    case "LEAVED_CARD":
      return `leaved this card`;

    case "ADD_MEMBER":
      return `added member "${data.memberName}" to this card`;

    case "COMPLETE_CARD":
      return `marked this card as complete`;

    case "INCOMPLETE_CARD":
      return `marked this card as incomplete`;

    case "UPLOAD_ATTACHMENT":
      return `attached "${data?.fileName}" to this card`;

    case "DELETE_ATTACHMENT":
      return `deleted "${data?.fileName}" to this card`;

    default:
      return "performed an action";
  }
}
