import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "../features/members/memberSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import MemberItem from "../components/MemberItem";
import { getAll, sendEmail } from "../features/emails/emailSlice";
import GeneratePDF from "../components/generatePDF";

const DashboardForGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { membersArr } = useSelector((state) => state.members);
  const { allEmails } = useSelector((state) => state.emails);

  // selected group_id
  const { groupID } = useParams();

  useEffect(() => {
    if (isError) toast.error(message);
    if (!user) {
      return navigate("/login");
    }

    if (user.role !== "admin") {
      return navigate("/");
    }

    if (allEmails.length === 0) {
      dispatch(getAll());
    }

    dispatch(getMembers(groupID));
  }, [user, navigate, dispatch, isError, message]);

  //these are for the sending of emails at the bottom of the dashboard
  const [email, setEmail] = useState("");
  const [hidden, setHidden] = useState(true);
  const onClick = () => {
    setHidden(false);
    setEmail("");
    setActive(null);
  };

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onCancel = () => {
    setHidden(true);
  };

  const submitEmail = (e) => {
    e.preventDefault();

    membersArr.forEach((member) => {
      const canSave = [
        email,
        member.email,
        member.title,
        member.group_id,
      ].every((el) => el.length >= 1);
      if (canSave) {
        try {
          dispatch(
            sendEmail({
              templateId: email,
              recipientEmail: member.email,
              recipientName: member.title,
              cohortName: member.group_id,
            })
          );
          toast.success(`Email Sent To ${member.title}`);
        } catch (error) {
          const message = error.message || error.toString();
          toast.error(`${member.title} error:`, message);
          console.log(message);
        }
      }
    });
  };

  // used to check is a student has incomplete items
  const isIncomplete = (member) => {
    const incomplete = [
      member.preWorkshopSurvey,
      member.infoQuestionnaire,
      member.consentFormMDASent,
      member.consentSigned,
      member.MDAsigned,
      member.oneOnOneAccess,
      member.dan_dana,
    ].some((el) => !el);

    return incomplete;
  };

  // this is for the form for each individual member that is currently being displayed (if any)
  const [active, setActive] = useState(null);

  // sorting the email select order
  const emailCopy = [...allEmails].sort((a, b) => {
    if (a.email_title < b.email_title) {
      return -1;
    }
    if (a.email_title > b.email_title) {
      return 1;
    }
    return 0;
  });

  let members = membersArr.filter((member) => member.group_id === groupID);

  const [showSpinner, setShowSpinner] = useState(false);
  if (showSpinner) return <Spinner />;

  const handleClick = async () => {
    setShowSpinner(true);

    // The following is for certificate generation
    // let members = membersArr.filter((member) => member.group_id === groupID);

    const today = new Date().toString();

    // FIX THIS TO HAVE A COMMA BEFORE THE YEAR
    const date = today.split(" ").splice(1, 3).join(" ");
    setTimeout(() => {
      const genForAll = async () => {
        setShowSpinner(true);
        members.forEach((member) => {
          // console.log("genAll Member", member);
          if (member.role !== "participant") {
            toast.error(
              `${member.title} must have participant role to generate certificate`
            );
            return;
          }
          GeneratePDF(member, date);
        });
      };
      genForAll();
    }, 0);

    // this time out is here because the genForAll is asyncronous and takes roughly 5 seconds to complete the forEach loop. This may be improved in the future
    setTimeout(() => {
      setShowSpinner(false);
    }, 3000);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      {user ? (
        <>
          <section className="heading">
            <h2>Operation Tracker For {groupID}</h2>
          </section>
          <div className="colors">
            <div>
              <div className="box lightBlue"></div>
              <p> = Complete,</p>
            </div>

            <div>
              <div className="box incomplete"></div>
              <p> = Incomplete</p>
            </div>
          </div>
          <section className="content">
            {membersArr.length > 0 ? (
              <>
                <div className="members">
                  {membersArr.map((member, index) =>
                    isIncomplete(member) ? (
                      <MemberItem
                        key={index}
                        member={member}
                        incomplete={true}
                        active={active}
                        setActive={setActive}
                        setHidden={setHidden}
                      />
                    ) : (
                      <MemberItem
                        key={index}
                        member={member}
                        incomplete={false}
                        active={active}
                        setActive={setActive}
                        setHidden={setHidden}
                      />
                    )
                  )}
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-secondary"
                    onClick={onClick}
                    hidden={!hidden}
                  >
                    Select Email To Send to Group
                  </button>

                  <form className="form email-form" hidden={hidden}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <select
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={onChange}
                      >
                        <option value="">Select an Email to send</option>
                        {allEmails.length > 0 &&
                          emailCopy.map((email) => (
                            <option value={email.id}>
                              {email.email_title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </form>

                  <button
                    className="btn btn-primary"
                    onClick={submitEmail}
                    hidden={hidden}
                  >
                    Send Email
                  </button>

                  <button
                    className="btn btn-cancel"
                    onClick={onCancel}
                    hidden={hidden}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={handleClick}
                    hidden={!hidden}
                  >
                    Generate Certificates for Group
                  </button>
                </div>
              </>
            ) : (
              <h3>No members to show</h3>
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
export default DashboardForGroup;
