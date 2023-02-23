import { useNavigate } from "react-router-dom";

const EmailItem = ({ email }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/emails/${email.id}`);
  };

  const onDelete = () => {
    navigate(`/confirm/${email.id}`);
  };

  return (
    <div className="calendar-body lightBlue">
      <div onClick={onClick}>
        <h2>{email.email_title}</h2>
      </div>
      <div className="delete">
        <div>
          <button onClick={onDelete} className="btn btn-delete">
            X
          </button>
        </div>
      </div>
    </div>
  );
};
export default EmailItem;
