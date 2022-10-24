import { BrowserRouter, Route } from "react-router-dom";

import NewGame from "../NewGame/index.jsx";
import Profile from "../Profile/index.jsx";

export default function Home() {
    return (
        <div id="Welcome">
            <div id="WelcomeTxt">
                <h4>Welcome to</h4>
                <div>
                    <h1 id="logo">TRIBES</h1>
                    <h1 id="logoShadow">TRIBES</h1>
                </div>
            </div>
            <BrowserRouter>
                <Route exact path="/">
                    <NewGame />
                </Route>
                <Route path="/profile">
                    <Profile />
                </Route>
            </BrowserRouter>
        </div>
    );
}
