import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import AnnoorContextProvider from "./context/AnnoorContext";
import AnnnoorAuthContextProvider from "./context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E14D2A",
    },
    secondary: {
      main: "#FF884B",
      light: "rgba(255, 153, 0, 0.3)",
    },

    // background: {
    //   default: "#f4f4f4",
    // },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <AnnoorContextProvider>
        <AnnnoorAuthContextProvider>
          <App />
        </AnnnoorAuthContextProvider>
      </AnnoorContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
