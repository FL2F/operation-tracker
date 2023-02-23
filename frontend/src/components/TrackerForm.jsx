import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GeneratePDF from "../components/generatePDF";
import { sendEmail } from "../features/emails/emailSlice";
import { editMember, getMembers } from "../features/members/memberSlice";
import "../styles/trackerForm.scss";

const TrackerForm = ({ member, active, setActive }) => {
  const dispatch = useDispatch();

  const { groupID } = useParams();

  const { allEmails } = useSelector((state) => state.emails);

  const [formValues, setFormValues] = useState({
    preWorkshopSurvey: member.preWorkshopSurvey,
    infoQuestionnaire: member.infoQuestionnaire,
    consentFormMDASent: member.consentFormMDASent,
    consentSigned: member.consentSigned,
    MDAsigned: member.MDAsigned,
    oneOnOneAccess: member.oneOnOneAccess,
    dan_dana: member.dan_dana,
    id: member.id,
  });

  const {
    preWorkshopSurvey,
    infoQuestionnaire,
    consentFormMDASent,
    consentSigned,
    MDAsigned,
    oneOnOneAccess,
    dan_dana,
    id,
  } = formValues;

  //these are for the sending of emails at the bottom of the dashboard
  const [email, setEmail] = useState({
    id: "",
    title: "",
  });

  const [hidden, setHidden] = useState(true);
  const onClick = (e) => {
    e.preventDefault();
    setHidden(false);
    setEmail("");
  };

  // Change function for setting the email
  const onChange = (e) => {
    const selectedEmail = allEmails.find(
      (email) => email.id === e.target.value
    );
    setEmail({ id: selectedEmail.id, title: selectedEmail.email_title });
  };

  // cancel button for member form email select
  const onCancel = (e) => {
    e.preventDefault();
    setHidden(true);
  };

  // submit send email for individual member
  const submitEmail = (e) => {
    e.preventDefault();
    console.log("email", email);

    const canSave = [
      email.id,
      member.email,
      member.title,
      member.group_id,
    ].every((el) => el.length >= 1);
    console.log("canSane", canSave);
    if (canSave) {
      try {
        if (email.title === "2.0-confidentiality-consent-agreement") {
          dispatch(
            editMember({
              preWorkshopSurvey: member.preWorkshopSurvey,
              infoQuestionnaire: member.infoQuestionnaire,
              consentFormMDASent: true,
              consentSigned: member.consentSigned,
              MDAsigned: member.MDAsigned,
              oneOnOneAccess: member.oneOnOneAccess,
              dan_dana: member.dan_dana,
              id,
            })
          );
        } else if (email.title === "1on1Access") {
          dispatch(
            editMember({
              preWorkshopSurvey: member.preWorkshopSurvey,
              infoQuestionnaire: member.infoQuestionnaire,
              consentFormMDASent: member.consentFormMDASent,
              consentSigned: member.consentSigned,
              MDAsigned: member.MDAsigned,
              oneOnOneAccess: true,
              dan_dana: member.dan_dana,
              id,
            })
          );
        }
        dispatch(
          sendEmail({
            templateId: email.id,
            recipientEmail: member.email,
            recipientName: member.title,
            cohortName: member.group_id,
          })
        );
        toast.success("Email Sent");
      } catch (error) {
        const message = error.message || error.toString();
        toast.error(message);
        console.log(message);
      }
    }
  };

  // update user info
  const submitUpdate = async () =>
    await dispatch(
      editMember({
        preWorkshopSurvey,
        infoQuestionnaire,
        consentFormMDASent,
        consentSigned,
        MDAsigned,
        oneOnOneAccess,
        dan_dana,
        id,
      })
    );

  // submit for tracker form for member
  const onSubmit = (e) => {
    e.preventDefault();
    try {
      // console.log("oneOnOneAccess :>> ", oneOnOneAccess);
      submitUpdate();
      dispatch(getMembers(groupID));
      toast.success("Member successfully updated");

      setActive(null);
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      toast.error(message);
      console.log(message);

      console.log("formValues", formValues);
      console.log("preWorkshopSurvey :>> ", preWorkshopSurvey);
      console.log("infoQuestionnaire :>> ", infoQuestionnaire);
      console.log("consentFormMDASent :>> ", consentFormMDASent);
      console.log("consentSigned :>> ", consentSigned);
      console.log("MDAsigned :>> ", MDAsigned);
      // console.log("oneOnOneAccess :>> ", oneOnOneAccess);
    }
  };

  // click for checkboxes
  const handleFormGroupClick = (fieldName) => {
    setFormValues({
      ...formValues,
      [fieldName]: !formValues[fieldName],
    });
  };

  const danDanaSelect = (e) => {
    setFormValues({
      ...formValues,
      dan_dana: e.target.value,
    });
  };

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

  const formClasses =
    active === String(member.id) ? "tracker-form" : "tracker-form disabled";

  // Date for the certificate generation
  // FIX THE JOIN TO BE WITH A COMMA
  const today = new Date().toString();

  const date = today.split(" ").splice(1, 3).join(" ");

  return (
    <form className={formClasses}>
      <div
        className="form-group"
        onClick={() => handleFormGroupClick("preWorkshopSurvey")}
      >
        <label htmlFor="pre-workshop">Completed Pre-Workshop Survery?</label>
        <input type="checkbox" checked={formValues.preWorkshopSurvey} />
      </div>

      <div
        className="form-group"
        onClick={() => handleFormGroupClick("infoQuestionnaire")}
      >
        <label htmlFor="info questionnaire">
          Completed Information Questionnaire?
        </label>
        <input type="checkbox" checked={formValues.infoQuestionnaire} />
      </div>

      <div
        className="form-group"
        onClick={() => handleFormGroupClick("consentFormMDASent")}
      >
        <label htmlFor="Consent & MDA Forms">Consent & MDA Forms Sent?</label>
        <input type="checkbox" checked={formValues.consentFormMDASent} />
      </div>

      <div
        className="form-group"
        onClick={() => handleFormGroupClick("consentSigned")}
      >
        <label htmlFor="Consent Signed">Consent Form Signed?</label>
        <input type="checkbox" checked={formValues.consentSigned} />
      </div>

      <div
        className="form-group"
        onClick={() => handleFormGroupClick("MDAsigned")}
      >
        <label htmlFor="MDA Signed">MDA Form Signed?</label>
        <input type="checkbox" checked={formValues.MDAsigned} />
      </div>

      <div
        className="form-group"
        onClick={() => handleFormGroupClick("oneOnOneAccess")}
      >
        <label htmlFor="1 on 1">1 on 1 Access Given?</label>
        <input type="checkbox" checked={formValues.oneOnOneAccess} />
      </div>
      <div
        className="form-group"
        // onClick={() => handleFormGroupClick("dan_dana")}
      >
        {/* <label htmlFor="dan_dana">Select DAN/DANA</label> */}
        <select
          type="text"
          name="dan_dana"
          id="dan_dana"
          value={dan_dana}
          onChange={danDanaSelect}
        >
          <option value="">DAN or DANA role</option>
          <option value="dan">Dan</option>
          <option value="dana">Dana</option>
        </select>
      </div>

      {/* <div className="form-group"></div> */}

      <div className="form-group btn-group">
        <button className="btn btn-primary" onClick={onSubmit} hidden={!hidden}>
          Submit Changes
        </button>
        <button
          className="btn btn-secondary"
          hidden={!hidden}
          onClick={onClick}
        >
          Select Email to Send
        </button>

        <form className="form email-form" hidden={hidden}>
          <label htmlFor="email">Select Email</label>
          <select
            type="text"
            name="email"
            id="email"
            value={email.id}
            onChange={onChange}
          >
            <option value="">Select an Email to send</option>
            {allEmails.length > 0 &&
              emailCopy.map((email) => (
                <option key={email.id} value={email.id}>
                  {email.email_title}
                </option>
              ))}
          </select>
        </form>

        {/* <div className="delete" hidden={hidden}> */}
        <button
          className="btn btn-primary"
          hidden={hidden}
          onClick={submitEmail}
        >
          Send Email
        </button>
        {/* </div> */}
        {/* <div className="delete" hidden={hidden}> */}
        <button className="btn btn-cancel" hidden={hidden} onClick={onCancel}>
          Cancel
        </button>
        {/* </div> */}

        {member.role === "participant" && (
          <button
            hidden={!hidden}
            className="btn btn-blue btn-add"
            type="submit"
            onClick={() => GeneratePDF(member, date)}
          >
            Generate Certificate
          </button>
        )}
      </div>
    </form>
  );
};

export default TrackerForm;
