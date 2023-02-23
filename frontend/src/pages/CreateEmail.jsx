import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { createEmail, getAll } from "../features/emails/emailSlice";
import { logout } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import logo from "../assets/FL2F-logo.png";

const CreateEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { allEmails, isError, isLoading, message } = useSelector(
    (state) => state.emails
  );

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
  }, [user, navigate, dispatch]);

  const [emailData, setEmailData] = useState({
    id: uuidv4(),
    email_title: "",
    subject: "FL2F - ",
    body: `Dear [recipientName],[br][br]Arya Milani, FL2F Program Assistant [br]Email: theteam@fl2f.ca[br]Website: https://www.fl2f.ca [br]<img
    src="https://www.queensu.ca/partnershipsandinnovation/sites/qpiwww/files/uploaded_files/patents/FL2F%20workshop%20logo.jpg"
    alt="logo"
    width="150px"
  />`,
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

    if (allEmails.some((email) => email.email_title === email_title)) {
      toast.error("Email Title Already Exists");
      return;
    }

    if (canSave) {
      try {
        dispatch(
          createEmail({
            id,
            email_title,
            subject,
            body,
          })
        );
        toast.success("Email successfully created");

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
        <h2>Create New Email</h2>
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
          Submit
        </button>
        <button className="btn btn-cancel" onClick={() => navigate(`/emails`)}>
          Cancel
        </button>
      </div>
    </section>
  );
};
export default CreateEmail;
