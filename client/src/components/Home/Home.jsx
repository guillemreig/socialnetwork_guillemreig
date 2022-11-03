import "./home.css";
// import { Component } from "react";
import { Route, Link } from "react-router-dom";

import Canvas from "./subcomponents/Canvas.jsx";
import Profile from "./subcomponents/Profile.jsx";
import SearchUser from "./subcomponents/SearchUser.jsx";
import UserPage from "./subcomponents/UserPage.jsx";
import Friends from "./subcomponents/Friends.jsx";
import OtherUser from "./subcomponents/OtherUser.jsx";

// REDUX
import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { receiveFriends } from "../../redux/root.js";

export default function Home() {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        picture: "",
        bio: "",
        created_at: "",
    });
    const [profileMenu, setProfileMenu] = useState(false);

    function logOut() {
        console.log("logOut()");

        fetch("/logout");
        history.pushState({}, "", `/`);
        location.reload();
    }

    function toggleProfile() {
        // Set it to the opposite of the current value
        console.log("toggleProfile()");

        setProfileMenu(!profileMenu);
    }

    function updateProfile(draft) {
        console.log("updateProfile(). draft :", draft);

        // Should remove message and editMode first (also closes edit mode)
        delete draft.message;
        delete draft.editMode;

        this.setState({ user: { ...draft } });
    }

    useEffect(() => {
        console.log("HOME useEffect()");

        // fetch user info from server
        fetch("/user/0.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                !data.bio && (data.bio = "");

                // add it to the state
                setUser(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div id="Home">
                <div className="backgroundHome"></div>
                <Canvas />
                <header>
                    <div className="logMenu">
                        <img
                            src={user.picture || "default_user.jpg"}
                            id="headerUserPicture"
                            alt="user picture"
                            onClick={toggleProfile}
                        />
                        <h3 className="button" onClick={toggleProfile}>
                            {user.first_name} {user.last_name}
                        </h3>
                    </div>
                    <SearchUser />
                    <div>
                        <h1 id="miniLogo">TRIBES</h1>
                    </div>
                    <div className="logMenu">
                        <Link to="/">
                            <h3 className="button">Home</h3>
                        </Link>
                        <Link to="/friends">
                            <h3 className="button">Friends</h3>
                        </Link>

                        <h3 className="button" onClick={logOut}>
                            Log out
                        </h3>
                        <img
                            src="/logout.png"
                            id="headerIcon"
                            alt="exit"
                            onClick={logOut}
                        />
                    </div>
                </header>
                {profileMenu && (
                    <Profile
                        user={user}
                        toggleProfile={toggleProfile}
                        updateProfile={updateProfile}
                    />
                )}
                <Route exact path="/">
                    <UserPage user={user} />
                </Route>
                <Route path="/friends">
                    <Friends user={user} />
                </Route>
                <Route path="/user/:id">
                    <OtherUser />
                </Route>
            </div>
        </>
    );
}

// export default class Home extends Component {
//     constructor() {
//         super();
//         this.state = {
//             user: {
//                 first_name: "",
//                 last_name: "",
//                 email: "",
//                 picture: "",
//                 bio: "",
//                 created_at: "",
//             },
//             profileMenu: false,
//         };

//         this.toggleProfile = this.toggleProfile.bind(this);
//         this.updateProfile = this.updateProfile.bind(this);
//     }

//     logOut() {
//         console.log("logOut()");
//         fetch("/logout");
//         history.pushState({}, "", `/`);
//         location.reload();
//     }

//     toggleProfile() {
//         // Set it to the opposite of the current value
//         console.log("toggleProfile()");
//         this.setState({
//             profileMenu: !this.state.profileMenu,
//         });
//     }

//     updateProfile(draft) {
//         console.log("updateProfile(). draft :", draft);

//         // Should remove message and editMode first (also closes edit mode)
//         delete draft.message;
//         delete draft.editMode;

//         this.setState({ user: { ...draft } });
//     }

//     componentDidMount() {
//         // fetch user info from server
//         fetch("/user/0.json")
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 !data.bio && (data.bio = "");

//                 // add it to the state
//                 this.setState({ user: data });
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     render() {
//         return (
//             <>
//                 <div id="Home">
//                     <div className="backgroundHome"></div>
//                     <Canvas />
//                     <header>
//                         <div className="logMenu">
//                             <img
//                                 src={
//                                     this.state.user.picture ||
//                                     "default_user.jpg"
//                                 }
//                                 id="headerUserPicture"
//                                 alt="user picture"
//                                 onClick={this.toggleProfile}
//                             />
//                             <h3 className="button" onClick={this.toggleProfile}>
//                                 {this.state.user.first_name}{" "}
//                                 {this.state.user.last_name}
//                             </h3>
//                         </div>
//                         <SearchUser />
//                         <div>
//                             <h1 id="miniLogo">TRIBES</h1>
//                         </div>
//                         <div className="logMenu">
//                             <h3 className="button">Friends</h3>
//                             <h3 className="button">Requests</h3>
//                             <h3 className="button" onClick={this.logOut}>
//                                 Log out
//                             </h3>
//                             <img
//                                 src="/logout.png"
//                                 id="headerIcon"
//                                 alt="exit"
//                                 onClick={this.logOut}
//                             />
//                         </div>
//                     </header>
//                     {this.state.profileMenu && (
//                         <Profile
//                             user={this.state.user}
//                             toggleProfile={this.toggleProfile}
//                             updateProfile={this.updateProfile}
//                         />
//                     )}
//                     <Route exact path="/">
//                         <UserPage user={this.state.user} />
//                     </Route>
//                     <Route path="/user/:id">
//                         <OtherUser />
//                     </Route>
//                 </div>
//             </>
//         );
//     }
// }
