import { useEffect, useState } from "react";
import { useParams } from "react-router";

function OtherUser() {
    const { id } = useParams();
    const [otherUser, setOtherUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        picture: "",
        bio: "",
        created_at: "",
        friendStatus: "",
    });

    useEffect(() => {
        console.log("OtherUserPage useEffect(id)");

        fetch(`/user/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                !data.bio && (data.bio = "");

                // add it to the state
                setOtherUser(data);

                console.log("otherUser :", otherUser);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    ///// STATE IN FUNCTION COMPONENT (classnotes) /////
    // const [values, handleChange] = useStatefulFields(); // values is an object, like the 'state' of a 'class' type component

    // function changeState(e) {
    //     setValues({
    //         ...values,
    //         [e.target.name]: e.target.value,
    //     }); // Keeps all the other properties of the 'values' state but changes the target one
    // }

    // changeState; // prevents error

    // const [error, onFormSubmit] = useAuthSubmit("/login", values);
    /// END OF CLASSNOTES /////

    // const fakeUsers = [
    //     { first_name: "Bob", last_name: "Dylan" },
    //     { first_name: "Jeb", last_name: "Kerman", picture: "default_user.jpg" },
    //     { first_name: "Alice", last_name: "Wond", picture: "default_user.jpg" },
    // ]; // Fake user list

    // function useEffect() {
    //     console.log("OtherUser mounted!");
    // }

    return (
        <div className="userPage">
            <div className="sidebar">
                <div className="userCard">
                    <img
                        id="picture"
                        src={otherUser.picture || "/default_user.jpg"}
                        alt=""
                    />
                    <div id="userInfo">
                        <h2>
                            {otherUser.first_name} {otherUser.last_name}
                        </h2>
                        <h4>{otherUser.email}</h4>
                        <h4>{otherUser.created_at}</h4>
                        <p>{otherUser.bio}</p>
                        <div className="centeredFlex">
                            <FriendButton id={id} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="timeline"></div>
        </div>
    );
}

export default OtherUser;

// CHILD
function FriendButton(props) {
    const [otherUserStatus, setOtherUserStatus] = useState("befriend");
    const { id } = props;

    useEffect(() => {
        console.log("FriendButton useEffect(). id: ", id);

        fetch(`/status/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("FriendButton data:", data);
                // add it to the state
                if (data.status == "self") {
                    setOtherUserStatus("hidden");
                } else if (data.status == false) {
                    data.receiver_id == id
                        ? setOtherUserStatus("cancel")
                        : setOtherUserStatus("accept");
                } else if (data.status == true) {
                    setOtherUserStatus("unfriend");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function sendFriendRequest() {
        console.log("sendFriendRequest. id:", id);

        fetch(`/befriend/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("sendFriendRequest data:", data);

                if (data.status == false) {
                    setOtherUserStatus("cancel");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function cancelFriendRequest() {
        console.log("cancelFriendRequest. id:", id);

        fetch(`/cancel/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("cancelFriendRequest data:", data);

                if (data.success == true) {
                    setOtherUserStatus("befriend");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function acceptFriendRequest() {
        console.log("acceptFriendRequest. id:", id);

        fetch(`/accept/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("acceptFriendRequest data:", data);

                if (data.success == true) {
                    setOtherUserStatus("unfriend");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function unfriendRequest() {
        console.log("unfriendRequest. id:", id);

        fetch(`/unfriend/${id}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("unfriendRequest data:", data);

                if (data.success == true) {
                    setOtherUserStatus("none");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            {otherUserStatus == "befriend" && (
                <button onClick={sendFriendRequest}>
                    Befriend ({otherUserStatus})
                </button>
            )}
            {otherUserStatus == "cancel" && (
                <button onClick={cancelFriendRequest}>
                    Cancel Request ({otherUserStatus})
                </button>
            )}
            {otherUserStatus == "accept" && (
                <button onClick={acceptFriendRequest}>
                    Accept Request ({otherUserStatus})
                </button>
            )}
            {otherUserStatus == "unfriend" && (
                <button onClick={unfriendRequest}>
                    Unfriend ({otherUserStatus})
                </button>
            )}
        </>
    );
}
