import axios from "axios";

const API_URL = "http://localhost:8080/api/groups/";
// const API_URL =
//   "https://operation-tracker-backend-3yvuhaorjq-uc.a.run.app/api/groups/";

// GET all members
const getAllGroups = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL, config);
  return data;
};

const memberService = { getAllGroups };

export default memberService;
