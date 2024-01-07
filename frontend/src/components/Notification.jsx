const Notification = ({ message, type }) => {
  return message ? (
    <div className={`notification ${type}`}>{message}</div>
  ) : null;
};

export default Notification;
