// import { useEffect, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "../../../redux/friends.slice";

export default function Friends(props) {
    // const [pendingFriends, setPendingFriends] = useState([]);
    // const [acceptedFriends, setAcceptedFriends] = useState([]);

    //Redux
    // useDispatch is used to dispatch action from component to redux store
    const dispatch = useDispatch();

    // useSelector is used to retrieve updated data from the global redux store
    const pendingFriends = useSelector((state) => {
        return state.friends.filter((user) => user.status === false);
    });

    const acceptedFriends = useSelector((state) => {
        return state.friends.filter((user) => user.status === true);
    });

    useEffect(() => {
        console.log("Friends useEffect");
        fetch("/friendships.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("data :", data); // 'data' is an array of objects: [{user1}, {user2}, ...]

                // const pendingArr = data.filter((user) => user.status === false);
                // const acceptedArr = data.filter((user) => user.status === true);

                // console.log("pendingArr :", pendingArr);
                // console.log("acceptedArr :", acceptedArr);

                // setPendingFriends(pendingArr);
                // setAcceptedFriends(acceptedArr);

                // Redux
                dispatch(setFriends(data));
            })
            .catch((error) => {
                console.log(error);
            });

        // dispatch(setFriends)
    }, []);

    return (
        <div className="userPage">
            <div className="sidebar">
                <div className="userCard">
                    <img
                        id="picture"
                        src={props.user.picture || "/default_user.jpg"}
                        alt=""
                    />
                    <div id="userInfo">
                        <h2>
                            {props.user.first_name} {props.user.last_name}
                        </h2>
                        <h4>{props.user.email}</h4>
                        <h4>{props.user.created_at}</h4>
                        <p>{props.user.bio}</p>
                    </div>
                </div>
            </div>
            <div className="timeline">
                <h1>PENDING REQUESTS</h1>
                <div className="friendList">
                    {pendingFriends.map((user) => (
                        <div key={user.first_name} className="logMenu">
                            <img
                                src={user.picture || "/default_user.jpg"}
                                id="headerUserPicture"
                                alt="user picture"
                            />
                            <Link to={`/user/${user.id}`}>
                                <h3>
                                    {user.first_name} {user.last_name}
                                </h3>{" "}
                            </Link>
                        </div>
                    ))}
                </div>
                <h1>ACCEPTED FRIENDS</h1>
                <div className="friendList">
                    {acceptedFriends.map((user) => (
                        <div key={user.first_name} className="logMenu">
                            <img
                                src={user.picture || "/default_user.jpg"}
                                id="headerUserPicture"
                                alt="user picture"
                            />
                            <Link to={`/user/${user.id}`}>
                                <h3>
                                    {user.first_name} {user.last_name}
                                </h3>{" "}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
