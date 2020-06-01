import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { withTheme } from "styled-components";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Form from "../components/Common/Form";

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
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

const Success = styled.p`
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 0.875em;
  color: rgba(0, 205, 93, 1);
`;

const Register = ({ history }) => {
  const [state, set] = useState({
    username: { touched: false, value: "" },
    password: { touched: false, value: "" },
    passwordConfirm: { touched: false, value: "" },
    firstname: { touched: false, value: "" },
    lastname: { touched: false, value: "" },
    email: { touched: false, value: "" }
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleBlur = e =>
    set({ ...state, [e]: { ...state[e], touched: true } });

  const handleChange = (val, e) => {
    set({ ...state, [e]: { ...state[e], value: val } });
  };

  const validation = () => ({
    username: state.username.value.trim() !== "",
    password: state.password.value.trim() !== "",
    passwordConfirm:
      state.password.value.trim() === state.passwordConfirm.value.trim(),
    firstname: state.firstname.value.trim() !== "",
    lastname: state.lastname.value.trim() !== "",
    email: state.email.value.trim() !== ""
  });

  const errors = validation();

  const handleSubmit = async () => {
    try {
      const resp = await fetch("/api/register", {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          username: state.username.value,
          password: state.password.value,
          firstname: state.firstname.value,
          lastname: state.lastname.value,
          email: state.email.value
        })
      });
      if (resp.status === 201) {
        setSuccess(true);
        return setTimeout(() => history.push("/login"), 3000);
      } else if (resp.status === 409) {
        return setError("Username and/or email already exist!");
      } else {
        return setError("Issue during registration!");
      }
    } catch (err) {
      return setError("Issue during registration!");
    }
  };

  return (
    <Page>
      <Form title="Register" error={error} onSubmit={handleSubmit}>
        {success && (
          <Success>Registration successful, Redirecting to login!</Success>
        )}
        <Input
          label="Username"
          type="text"
          name="username"
          value={state.username.value}
          error={state.username.touched && !errors["username"]}
          onBlur={() => handleBlur("username")}
          onChange={e => handleChange(e.target.value, "username")}
          autocomplete="username"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={state.password.value}
          error={state.password.touched && !errors["password"]}
          onBlur={() => handleBlur("password")}
          onChange={e => handleChange(e.target.value, "password")}
          autocomplete="password"
        />
        <Input
          label="Confirm Password"
          type="password"
          name="passwordConfirm"
          value={state.passwordConfirm.value}
          error={state.passwordConfirm.touched && !errors["passwordConfirm"]}
          onBlur={() => handleBlur("passwordConfirm")}
          onChange={e => handleChange(e.target.value, "passwordConfirm")}
          autocomplete="password"
        />
        <Input
          label="Firstname"
          type="text"
          name="firstname"
          value={state.firstname.value}
          error={state.firstname.touched && !errors["firstname"]}
          onBlur={() => handleBlur("firstname")}
          onChange={e => handleChange(e.target.value, "firstname")}
          autocomplete="firstname"
        />
        <Input
          label="Lastname"
          type="text"
          name="lastname"
          value={state.lastname.value}
          error={state.lastname.touched && !errors["lastname"]}
          onBlur={() => handleBlur("lastname")}
          onChange={e => handleChange(e.target.value, "lastname")}
          autocomplete="lastname"
        />
        <Input
          label="Email"
          type="text"
          name="email"
          value={state.email.value}
          error={state.email.touched && !errors["email"]}
          onBlur={() => handleBlur("email")}
          onChange={e => handleChange(e.target.value, "email")}
          autocomplete="email"
        />
        <Button disabled={!Object.keys(errors).some(x => errors[x])}>
          Register
        </Button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Page>
  );
};

export default withTheme(Register);
