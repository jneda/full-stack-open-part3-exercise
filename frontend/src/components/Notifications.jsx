import Notification from "./Notification";

const Notifications = ({ errorMessage, successMessage }) => {
  const ERROR = "error";
  const SUCCESS = "success";

  return successMessage ? (
    <Notification message={successMessage} type={SUCCESS} />
  ) : errorMessage ? (
    <Notification message={errorMessage} type={ERROR} />
  ) : null;
};

export default Notifications;
