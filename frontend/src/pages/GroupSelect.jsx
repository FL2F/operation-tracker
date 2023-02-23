import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import GroupItem from "../components/GroupItem";
import { getAllGroups } from "../features/groups/groupSlice";
import { logout } from "../features/auth/authSlice";
import { getAll } from "../features/members/memberSlice";
import MemberItem from "../components/MemberItem";
import "../styles/groupSelect.scss";

const GroupSelect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { groupsArr } = useSelector((state) => state.groups);
  const { allMembers } = useSelector((state) => state.members);

  const [userSelect, setUserSelect] = useState("");

  useEffect(() => {
    if (isError) toast.error(message);
    if (!user) return navigate("/login");
    if (user.role !== "admin") {
      toast.error("User not authorized");
      dispatch(logout());
      return navigate("/login");
    }
    if (groupsArr.length === 0) {
      dispatch(getAllGroups());
    }

    if (allMembers.length === 0) {
      dispatch(getAll());
    }
  }, [user, navigate, dispatch, isError, message]);

  let groups = [];
  groupsArr.forEach((group) => {
    if (!groups.includes(group.group_id)) groups.push(group);
  });

  groups.sort((a, b) => (a.role < b.role ? 1 : -1));

  let filteredMembers = userSelect
    ? allMembers.filter((member) =>
        member.title
          ? member.title.toLowerCase().includes(userSelect.toLowerCase())
          : member.username.toLowerCase().includes(userSelect.toLowerCase())
      )
    : [];

  if (isLoading) return <Spinner />;

  return (
    <>
      {user ? (
        <>
          <section className="heading">
            <h2>FL2F Operations Tracker</h2>
          </section>
          <div className="form-group userSelect">
            <label htmlFor="userSelect">Search members</label>
            <input
              type="text"
              name="text"
              id="userSelect"
              placeholder="Search for a member"
              value={userSelect}
              onChange={(e) => setUserSelect(e.target.value)}
            />
          </div>
          <div className="colors">
            <div>
              <div className="box lightBlue"></div>
              <p> = Participant Group,</p>
            </div>
            <div>
              <div className="box green"></div>
              <p> = Alumni Group,</p>
            </div>
            <div>
              <div className="box blue"></div>
              <p> = Admin Group</p>
            </div>
          </div>
          <section className="content">
            {groupsArr.length > 0 && userSelect === "" ? (
              <div className=" members">
                {groups.map((group, index) => (
                  <GroupItem
                    key={index}
                    group={group.group_id}
                    color={
                      group.role === "alumni"
                        ? "green"
                        : group.role === "participant"
                        ? "lightBlue"
                        : "blue"
                    }
                  />
                ))}
              </div>
            ) : userSelect !== "" ? (
              <div className=" members">
                {filteredMembers.map((member, index) => (
                  <MemberItem key={index} member={member} />
                ))}
              </div>
            ) : (
              <h3>No groups to show</h3>
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
export default GroupSelect;
