import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="body-container">
      <h2>404! Page Not Found!</h2>
      <Link to="/">
        {" "}
        <button className="btn btn-block btn-primary">Go Back</button>
      </Link>
    </div>
  );
};
export default ErrorPage;
