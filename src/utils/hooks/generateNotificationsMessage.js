export function generateNotificationsMessage(type, data) {
  switch (type) {
    case "TAGGED_IN_COMMENT":
      return `tagged you in a comment`;

    default:
      return "performed an action";
  }
}
