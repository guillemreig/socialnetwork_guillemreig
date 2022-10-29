import { useEffect, useState } from "react";
import { useParams } from "react-router";

function OtherUser() {
    const [otherUser, setOtherUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        picture: "",
        bio: "",
        created_at: "",
    });
    const { id } = useParams();

    console.log("id:", id);

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
                            <button>Befriend</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="timeline"></div>
        </div>
    );
}

export default OtherUser;
