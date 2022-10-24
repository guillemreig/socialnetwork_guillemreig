import { Component } from "react";

// import { BrowserRouter, Route } from "react-router-dom";

import NewGame from "./NewGame.jsx";
import Profile from "./Profile.jsx";
import Uploader from "./Profile.jsx";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "placeholder",
            isPopupOpen: false,
        };

        this.togglePopup = this.togglePopup.bind(this);
    }

    componentDidMount() {
        // fetch user info from server
        // add it to the state
    }

    togglePopup() {
        // Set it to the opposite of the current value
        this.setState({
            isPopupOpen: !this.state.isPopupOpen,
        });
    }

    // setProfilePic(url) {

    // }

    render() {
        return (
            <div id="Welcome">
                <div id="WelcomeTxt">
                    <h4>Welcome to</h4>
                    <div>
                        <h1 id="logo">TRIBES</h1>
                        <h1 id="logoShadow">TRIBES</h1>
                    </div>
                    <NewGame />
                    <Profile
                        userName={this.state.userName}
                        togglePopup={this.togglePopup}
                    />
                    {this.isPopupOpen && <Uploader />}
                </div>
            </div>
        );
    }
}
