import "./style.css";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Registration from "../Registration/index.jsx";
import Login from "../Login/index.jsx";

export default class Welcome extends React.Component {
    render() {
        return (
            <div id="Welcome">
                <div id="WelcomeTxt">
                    <h4>Welcome to</h4>
                    <h1 id="logo">TRIBES</h1>
                    <h3>Join now and claim your</h3>
                    <h2>FREEDOM</h2>
                </div>
                <BrowserRouter>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route path="/signup">
                        <Registration />
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}
