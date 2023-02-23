import TrackerForm from "./TrackerForm";

const MemberItem = ({ member, incomplete, active, setActive, setHidden }) => {
  const onClick = () => {
    active === member.id ? setActive(null) : setActive(member.id);
    setHidden(true);

    console.log("active", active);
  };

  const classes =
    incomplete && active !== member.id
      ? "calendar-body incomplete"
      : active === member.id
      ? "calendar-body active"
      : "calendar-body";

  return (
    <div>
      <div className={classes} onClick={onClick}>
        <div>
          <h2>{member.title ? member.title : member.username}</h2>
        </div>
      </div>

      <TrackerForm member={member} active={active} setActive={setActive} />
    </div>
  );
};
export default MemberItem;
