import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEmail, getAll } from "../features/emails/emailSlice";

const Confirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { emailID } = useParams();

  const onCancel = () => {
    navigate(`/emails`);
  };
  const onDelete = () => {
    dispatch(deleteEmail(emailID));
    dispatch(getAll());
    navigate(`/emails`);
  };

  return (
    <main className="confirm">
      <h1>Are you sure you want to delete this email?</h1>
      <section className="actions">
        <button className="btn btn-block btn-danger" onClick={onDelete}>
          Delete
        </button>
        <button className="btn btn-block btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </section>
    </main>
  );
};
export default Confirm;
