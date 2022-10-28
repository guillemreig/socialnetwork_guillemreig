import "./welcome.css";
import { Route } from "react-router-dom";

import Login from "./subcomponents/Login.jsx";
import Registration from "./subcomponents/Registration.jsx";
import Password from "./subcomponents/Password.jsx";

export default function Welcome() {
    return (
        <div id="Welcome">
            <div className="backgroundWelcome"></div>
            <div className="titleTxt">
                <div>
                    <h4 className="shadow">Welcome to</h4>
                    <h4 className="title">Welcome to</h4>
                </div>
                <div>
                    <h1 id="logoShadow">TRIBES</h1>
                    <h1 id="logo">TRIBES</h1>
                </div>
                <div>
                    <h3 className="shadow">Join now and claim your</h3>
                    <h3 className="title">Join now and claim your</h3>
                </div>
                <div>
                    <h2 className="shadow">FREEDOM</h2>
                    <h2 className="title">FREEDOM</h2>
                </div>
            </div>
            <Route exact path="/">
                <Login />
            </Route>

            <Route path="/signup">
                <Registration />
            </Route>

            <Route path="/password">
                <Password />
            </Route>
        </div>
    );
}
