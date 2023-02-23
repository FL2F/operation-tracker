import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { editEmail, getAll } from "../features/emails/emailSlice";
import { logout } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

const EditEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { allEmails, isError, isLoading, message } = useSelector(
    (state) => state.emails
  );

  const { emailID } = useParams();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
    if (isError) toast.error(message);

    if (user.role !== "admin") {
      toast.error("User not authorized");
      dispatch(logout());
      return navigate("/login");
    }

    if (allEmails.length === 0) {
      dispatch(getAll());
    }
  }, [user, isError, message, navigate, dispatch]);

  let email = allEmails.find((email) => email.id === emailID);

  const [emailData, setEmailData] = useState({
    id: email && email.id ? email.id : uuidv4(),
    email_title: email && email.email_title ? email.email_title : "",
    subject: email && email.subject ? email.subject : "",
    body: email && email.body ? email.body : "",
  });

  const { id, email_title, subject, body } = emailData;

  const onChange = (e) => {
    setEmailData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit schedule and events
  const onSubmit = (e) => {
    e.preventDefault();
    const canSave = [
      id,
      email_title,
      subject,
      body,
      // phonenumber, and linkedin are not required
    ].every((el) => el.length >= 1);

    if (canSave) {
      try {
        dispatch(
          editEmail({
            id,
            email_title,
            subject,
            body,
          })
        );
        toast.success("Email successfully updated");

        dispatch(getAll());
        navigate(`/emails`);
      } catch (error) {
        const message =
          error.response.data.message || error.message || error.toString();
        toast.error(message);
        console.log(message);
      }
    } else {
      toast.error("All fields are required", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("id", id);
      console.log("email_title", email_title);
      console.log("subject", subject);
      console.log("body", body);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <section className="schedule-form">
      <div className="heading">
        <h2>Edit Email {email.email_title}</h2>
      </div>

      <form className="form">
        <div className="form-group">
          <label htmlFor="email_title">Email Title *</label>
          <input
            type="text"
            name="email_title"
            id="email_title"
            placeholder="Enter a title"
            value={email_title}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            name="subject"
            id="subject"
            placeholder="Enter a subject"
            value={subject}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">Email Body Text *</label>
          <textarea
            type="text"
            name="body"
            id="body"
            placeholder="Enter email body text"
            rows={10}
            value={body}
            onChange={onChange}
          />
        </div>
      </form>
      <div className="btn-group">
        <button className="btn btn-primary" type="submit" onClick={onSubmit}>
          Update Email
        </button>
        <button className="btn btn-cancel" onClick={() => navigate(`/emails`)}>
          Cancel
        </button>
      </div>
    </section>
  );
};
export default EditEmail;
