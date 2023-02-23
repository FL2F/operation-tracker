import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { logout } from "../features/auth/authSlice";

import "../styles/groupSelect.scss";
import EmailItem from "../components/EmailItem";
import { getAll } from "../features/emails/emailSlice";

const Emails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const { allEmails } = useSelector((state) => state.emails);

  useEffect(() => {
    if (isError) toast.error(message);
    if (!user) return navigate("/login");
    if (user.role !== "admin") {
      toast.error("User not authorized");
      dispatch(logout());
      return navigate("/login");
    }

    if (allEmails.length === 0) {
      dispatch(getAll());
    }
  }, [user, navigate, dispatch, isError, message]);

  // sorting the email select
  const emailCopy = [...allEmails].sort((a, b) => {
    if (a.email_title < b.email_title) {
      return -1;
    }
    if (a.email_title > b.email_title) {
      return 1;
    }
    return 0;
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      {user ? (
        <>
          <section className="heading">
            <h2>Email Templates</h2>
            <button
              className="btn btn-primary btn-add"
              type="submit"
              onClick={() => navigate(`/create-email`)}
            >
              Create New Email Template
            </button>
          </section>
          <section className="content">
            {allEmails.length > 0 ? (
              <div className=" members">
                {emailCopy.map((email, index) => (
                  <EmailItem key={index} email={email} />
                ))}
              </div>
            ) : (
              <h3>No emails show</h3>
            )}
          </section>
        </>
      ) : (
        <>
          <h2>You're not logged in</h2>
          <Link to="/login">
            <button className="btn btn-primary btn-block" type="submit">
              Please Login
            </button>
          </Link>
        </>
      )}
    </>
  );
};
export default Emails;
