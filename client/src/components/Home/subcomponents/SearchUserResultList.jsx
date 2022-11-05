import { Link } from "react-router-dom";

function FindUserResultList({ users, setResultList }) {
    return (
        <div id="resultList">
            {users.map((user) => (
                <div
                    key={user.first_name}
                    className="logMenu"
                    onClick={() => setResultList(false)}
                >
                    <img
                        src={user.picture || "/default_user.jpg"}
                        id="headerUserPicture"
                        alt="user picture"
                    />
                    <Link to={`/user/${user.id}`}>
                        <h3 className="button">
                            {user.first_name} {user.last_name}
                        </h3>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default FindUserResultList;
