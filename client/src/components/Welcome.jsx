import "./style.css";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./Login.jsx";
import Registration from "./Registration.jsx";
import Password from "./Password.jsx";

export default function Welcome() {
    return (
        <div id="Welcome">
            <div id="WelcomeTxt">
                <h4>Welcome to</h4>
                <div>
                    <h1 id="logo">TRIBE</h1>
                    <h1 id="logoShadow">TRIBE</h1>
                </div>
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

                <Route path="/password">
                    <Password />
                </Route>
            </BrowserRouter>
        </div>
    );
}
