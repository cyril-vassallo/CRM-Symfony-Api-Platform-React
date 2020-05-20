
//Important import !
import '../css/app.css';
import React from "react"; 
import ReactDome from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';

/**
 * PDoc
 * 
 * We need an HashRouter to fix all react route to "/" and 
 * (Because Symfony only have a controller with  localhost:8000/ route ) 
 * http://localhost:8000/#/customer
 * http://localhost:8000/#/invoice
 * 
 *  
 * */ 




console.log('Hello Webpack Encore!!! Edit me in assets/js/app.js');

const App = () => {
    return (
    <HashRouter> 
        <Navbar/>
        <main className="container pt-5">
            <Switch>
                <Route path="/customers" component={CustomersPage}/>
                <Route path="/invoices" component={InvoicesPage}/>
                <Route path="/" component={HomePage}/>
            </Switch>
        </main>
    </HashRouter>
    );
};

const rootElement  = document.querySelector('#app');
ReactDome.render(<App />, rootElement)