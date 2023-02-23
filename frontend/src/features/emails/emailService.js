import axios from "axios";

const API_URL = "http://localhost:8080/api/emails/";
// const API_URL =
//   "https://operation-tracker-backend-3yvuhaorjq-uc.a.run.app/api/emails/";

// GET all Emails
const getAll = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL, config);
  return data;
};
// GET Specific email
const getSpecificEmail = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + id, config);
  return data;
};

//Create a new email
const createEmail = async (emailData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.post(API_URL, emailData, config);

  return data;
};

//Edit Email
const editEmail = async (id, emailData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.put(API_URL + id, emailData, config);
  return data;
};

//Delete Email
const deleteEmail = async (emailID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.delete(API_URL + emailID, config);
  return data;
};

const sendEmail = async (emailData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.post(API_URL + "send-email", emailData, config);
  return data;
};

const memberService = {
  getAll,
  getSpecificEmail,
  createEmail,
  editEmail,
  deleteEmail,
  sendEmail,
};

export default memberService;
