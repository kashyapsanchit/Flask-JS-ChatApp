import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import useSocket from "./hooks";

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
}
  body {
    margin: 0;
    padding: 0;
  }
  #root {
    height: 100vh;
    width: 100vw;
  }
`;

function App() {
  const [socket, auth] = useSocket();
  const nightModeState = useSelector(state => state.rootReducer.ui.mode);
  const theme = {
    background: nightModeState ? "rgb(31, 31, 31)" : "rgb(245, 245, 245)",
    border: nightModeState
      ? "1px solid rgba(245,245,245,0.1)"
      : "1px solid rgba(0,0,0,.1)",
    messageBackground: nightModeState
      ? "rgba(245, 245, 245, 0.2)"
      : "rgba(0, 0, 0, 0.075)",
    inputBackground: nightModeState ? "#4a4a4a" : "rgba(0, 0, 0, 0.1)",
    elemBackground: nightModeState
      ? "rgba(245, 245, 245, 0.2)"
      : "rgba(245, 245, 245, 0.2)",
    elemBackgroundHover: nightModeState
      ? "rgba(245, 245, 245, .05)"
      : "rgba(0, 0, 0, .05)",
    foregroundColor: nightModeState
      ? "rgba(245, 245, 245, 0.8)"
      : "rgba(0, 0, 0, 0.8)",
    backgroundColor: nightModeState
      ? "rgba(245, 245, 245, 0.6)"
      : "rgba(0, 0, 0, 0.6)",
    nightModeBtn: nightModeState ? "#f0c420" : "rgba(0, 0, 0, 0.5)",

    buttonBackground: nightModeState ? "transparent" : "rgba(0, 0, 0, 0.8)",
    buttonBorder: nightModeState ? "1px solid rgba(245,245,245,0.1)" : "none",
    buttonText: "rgba(245, 245, 245, 0.8)",
    transition: "all .5s cubic-bezier(0.39, 0.575, 0.565, 1)"
  };
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!auth ? (
        <Route exact path="/login" component={Login} />
      ) : (
        <Redirect to="/" />
      )}
      {!auth ? (
        <Route exact path="/register" component={Register} />
      ) : (
        <Redirect to="/" />
      )}
      <Route
        exact
        path="/"
        render={() =>
          auth ? <Home socket={socket.current} /> : <Redirect to="/login" />
        }
      />
    </ThemeProvider>
  );
}

export default App;
