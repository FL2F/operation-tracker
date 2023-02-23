import axios from "axios";

const API_URL = "http://localhost:8080/api/members/";
// const API_URL =
//   "https://operation-tracker-backend-3yvuhaorjq-uc.a.run.app/api/members/";

// GET all Members for user's group
const getAllMembersForGroup = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL, config);
  return data;
};
// GET all Members for a specific group
const getMembers = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + id, config);
  return data;
};

//Edit Member
const editMember = async (id, memberData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.put(API_URL + id, memberData, config);
  return data;
};

const memberService = { getAllMembersForGroup, getMembers, editMember };

export default memberService;
