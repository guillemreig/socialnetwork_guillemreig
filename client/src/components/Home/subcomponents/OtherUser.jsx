// import { useEffect, useState } from "react";

function OtherUser() {
    // const [otherUser, setOtherUser] = useState();

    const fakeUser = {
        id: 0,
        first_name: "Test",
        last_name: "Tester",
        email: "fake@email.com",
        bio: "This is a fake bio used for testing purposes.",
        picture: "",
    };

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
                        src={fakeUser.picture || "/default_user.jpg"}
                        alt=""
                    />
                    <div id="userInfo">
                        <h2>
                            {fakeUser.first_name} {fakeUser.last_name}
                        </h2>
                        <h4>{fakeUser.email}</h4>
                        <h4>{fakeUser.created_at}</h4>
                        <p>{fakeUser.bio}</p>
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
