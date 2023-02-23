// Stylesheet
import "../styles/login.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Image from "../assets/FL2F-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
      return;
    }
    if (isSuccess && user && user !== null) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, dispatch, navigate, isSuccess, isError, message]);

  const onClick = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all the fields");
      return;
    }
    dispatch(login({ username: username, password: password }));
    navigate("/");
  };

  if (isLoading) return <Spinner />;

  return (
    <form method="post" className="login">
      <img src={Image} alt="logo" />
      <h2 className="login-title">Operation Tracker</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        id="username"
        required
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
      />
      <button type="submit" className="btn btn-login" onClick={onClick}>
        Login
      </button>
    </form>
  );
};

export default Login;
