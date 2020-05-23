import React, {useContext} from 'react';
import AuthAPI from '../services/AuthAPI';
import {NavLink} from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    const handleLogout = () => {
       AuthAPI.logout(); 
       setIsAuthenticated(false);
       history.push('/login');
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink className="navbar-brand" to="/">
          CRM React
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                activeStyle={{
                  fontWeight: "bold",
                  color: "red",
                }}
                className="nav-link"
                to="/customers"
              >
                Clients
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                activeStyle={{
                  fontWeight: "bold",
                  color: "red",
                }}
                className="nav-link"
                to="/invoices"
              >
                Factures
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {(!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink
                    activeStyle={{
                      fontWeight: "bold",
                      color: "red",
                    }}
                    to="/register"
                    className="nav-link m-1"
                  >
                    Inscription
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="btn btn-success">
                    Connexion
                  </NavLink>
                </li>
              </>
            )) || (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
}
 
export default Navbar;