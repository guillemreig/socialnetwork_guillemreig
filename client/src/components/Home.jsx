import { Component } from "react";

// import { BrowserRouter, Route } from "react-router-dom";

// import NewGame from "./NewGame.jsx";
import Profile from "./Profile.jsx";
import Uploader from "./Profile.jsx";

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            user: {
                first_name: "",
                last_name: "",
                email: "",
                picture: "",
                bio: "",
            },
            profileMenu: false,
        };

        this.toggleProfile = this.toggleProfile.bind(this);
    }

    logOut() {
        console.log("logOut()");
        fetch("/logout");
        location.reload();
    }

    toggleProfile() {
        // Set it to the opposite of the current value
        console.log("toggleProfile()");
        this.setState({
            profileMenu: !this.state.profileMenu,
        });
    }

    updateProfile(data) {
        console.log("updateProfile()");

        for (const property in data) {
            this.setState({ [property]: data[property] });
        }
    }

    componentDidMount() {
        console.log("componentDidMount()");
        // fetch user info from server
        // add it to the state
        fetch("/user")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                !data.bio && (data.bio = "");
                this.setState({ user: data });
                console.log("this.state.user :", this.state.user);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div id="Home">
                <header>
                    <div className="logMenu">
                        <img
                            src={this.state.user.picture || "default_user.jpg"}
                            id="headerUserPicture"
                            alt="user picture"
                            onClick={this.toggleProfile}
                        />
                        <h3 className="button" onClick={this.toggleProfile}>
                            {this.state.user.first_name}{" "}
                            {this.state.user.last_name}
                        </h3>
                    </div>
                    <div>
                        <h1 id="miniLogo">TRIBE</h1>
                        <h1 id="miniLogoShadow">TRIBE</h1>
                    </div>
                    <div className="logMenu">
                        <img
                            src="logout.png"
                            id="headerIcon"
                            alt="exit"
                            onClick={this.logOut}
                        />
                        <h3 className="button" onClick={this.logOut}>
                            Log out
                        </h3>
                    </div>
                </header>

                {/* <NewGame /> */}
                {this.state.profileMenu && (
                    <Profile
                        user={this.state.user}
                        toggleProfile={this.toggleProfile}
                        updateProfile={this.updateProfile}
                    />
                )}

                {this.isPopupOpen && <Uploader />}
            </div>
        );
    }
}
