import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "assets/scss/material-kit-react.scss?v=1.9.0";
import LoginPage from "views/LoginPage/LoginPage.js";

import { CookiesProvider } from 'react-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
var hist = createBrowserHistory();

ReactDOM.render(
  <CookiesProvider>
    <Router history={hist}>
      <Switch>
        <Route path="/" component={LoginPage} />
      </Switch>
    </Router>
  </CookiesProvider>
  ,
  document.getElementById("root")
);
