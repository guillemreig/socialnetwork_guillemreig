import "./home.css";
import { Route, Link } from "react-router-dom";

import Canvas from "./subcomponents/Canvas.jsx";
import Profile from "./subcomponents/Profile.jsx";
import SearchUser from "./subcomponents/SearchUser.jsx";
import UserPage from "./subcomponents/UserPage.jsx";
import Friends from "./subcomponents/Friends.jsx";
import OtherUser from "./subcomponents/OtherUser.jsx";
import Chat from "./subcomponents/Chat.jsx";

// REDUX
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../../redux/reducer.js";

export default function Home() {
    const dispatch = useDispatch(); // For some reason this conversion is mandatory

    const user = useSelector((state) => state.user);
    const [profileMenu, setProfileMenu] = useState(false); // is the profile window open? (default 'false')

    function logOut() {
        console.log("logOut()");
        dispatch(logoutUser());

        fetch("/logout");
        history.pushState({}, "", `/`);
        location.reload();
    }

    function toggleProfile() {
        setProfileMenu(!profileMenu); // Set it to the opposite of the current value
    }

    function updateProfile(draft) {
        console.log("updateProfile(). draft :", draft);

        // Should remove message and editMode first (also closes edit mode)
        delete draft.message;
        delete draft.editMode;

        // this.setState({ user: { ...draft } });

        // setUser({ ...draft });
    }

    useEffect(() => {
        fetch("/user/0.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                !data.bio && (data.bio = "");

                data && dispatch(loginUser(data)); // fetch user info from server and send it to redux global store
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
                <Chat />
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
