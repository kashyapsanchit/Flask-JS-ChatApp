import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Form from "../components/Common/Form";
import { login } from "../redux/actions";
import ToggleSwitch from "../components/Common/ToggleSwitch";

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  & > p {
    text-align: center;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 0.875em;
    color: rgba(0, 0, 0, 0.6);

    & > a {
      text-decoration: none;
      color: inherit;
      color: rgba(0, 0, 0, 0.8);
    }
  }
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 0.775em;
  color: rgba(0, 0, 0, 0.6);
  & > span {
    margin-right: .5rem
  }
`;

const Login = () => {
  const [state, set] = useState({
    username: { touched: false, value: "" },
    password: { touched: false, value: "" },
    rememberMe: false
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleBlur = e =>
    set({ ...state, [e]: { ...state[e], touched: true } });
  const handleChange = (e, val) =>
    set({ ...state, [e]: { ...state[e], value: val } });

  const validation = () => ({
    username: state.username.value.trim() !== "",
    password: state.password.value.trim() !== ""
  });

  const errors = validation();

  const handleSubmit = async e => {
    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: state.username.value,
          password: state.password.value,
          remember: state.rememberMe
        })
      });

      if (resp.status === 200) {
        const json = await resp.json();
        dispatch(login(json));
      } else if (resp.status === 401) {
        setError("Incorrect username/password");
      }
    } catch (err) {
      // Ignore
    }
  };

  return (
    <Page>
      <Form title="Login" error={error} onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={state.username.value}
          onChange={e => handleChange("username", e.target.value)}
          error={state.username.touched ? !errors["username"] : false}
          onBlur={() => handleBlur("username")}
          autocomplete="username"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={state.password.value}
          onChange={e => handleChange("password", e.target.value)}
          error={state.password.touched ? !errors["password"] : false}
          onBlur={() => handleBlur("password")}
          autocomplete="password"
        />
        <CheckLabel>
          <span>Remember me</span>
          <ToggleSwitch
            onClick={() => set({ ...state, rememberMe: !state.rememberMe })}
            state={state.rememberMe}
          />
        </CheckLabel>
        <Button
          type="submit"
          disabled={!Object.keys(errors).some(x => errors[x])}
        >
          Login
        </Button>
      </Form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Page>
  );
};

export default Login;
