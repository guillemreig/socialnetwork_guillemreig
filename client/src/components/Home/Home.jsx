import "./home.css";
import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Profile from "./subcomponents/Profile.jsx";
import SearchUser from "./subcomponents/SearchUser.jsx";
import OtherUser from "./subcomponents/OtherUserPage.jsx";

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
                created_at: "",
            },
            profileMenu: false,
        };

        this.toggleProfile = this.toggleProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
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

    updateProfile(draft) {
        console.log("updateProfile(). draft :", draft);

        // Should remove message and editMode first (also closes edit mode)
        delete draft.message;
        delete draft.editMode;

        this.setState({ user: { ...draft } });
    }

    componentDidMount() {
        console.log("componentDidMount()");
        // fetch user info from server
        fetch("/user/0.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                !data.bio && (data.bio = "");

                // add it to the state
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
                <div className="backgroundHome"></div>
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
                    <SearchUser />
                    <div>
                        <h1 id="miniLogo">TRIBES</h1>
                    </div>
                    <div className="logMenu">
                        <img
                            src="/logout.png"
                            id="headerIcon"
                            alt="exit"
                            onClick={this.logOut}
                        />
                        <h3 className="button" onClick={this.logOut}>
                            Log out
                        </h3>
                    </div>
                </header>
                {this.state.profileMenu && (
                    <Profile
                        user={this.state.user}
                        toggleProfile={this.toggleProfile}
                        updateProfile={this.updateProfile}
                    />
                )}

                <BrowserRouter>
                    <Route exact path="/">
                        <h1>THIS REPRESENTS THE USER PAGE</h1>
                    </Route>
                    <Route path="/user/:id">
                        <OtherUser />
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}

// 1. APP mounts: fetch user data from db using req.session.id and puts it in the APP user state

// 2. APP gives Profile the user state as 'props'
