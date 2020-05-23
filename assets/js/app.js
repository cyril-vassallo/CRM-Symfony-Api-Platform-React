//Important import !
import React, { useState } from "react";
import ReactDome from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import "../css/app.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
//import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import AuthAPI from "./services/AuthAPI";

/**
 *
 * We need an HashRouter to fix all react route to "/" and
 * (Because Symfony only have a controller with  localhost:8000/ route )
 * http://localhost:8000/#/customer
 * http://localhost:8000/#/invoice
 *
 *
 * */

AuthAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );
  console.log(isAuthenticated);

  const NavbarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <HashRouter>
        <NavbarWithRouter />
        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDome.render(<App />, rootElement);
