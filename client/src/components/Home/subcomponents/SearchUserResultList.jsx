import { Link } from "react-router-dom";

function FindUserResultList({ users }) {
    return (
        <div id="resultList" className="formMenu">
            {users.map((user) => (
                <div key={user.first_name}>
                    <Link to={`/user/${user.id}`}>
                        <div className="logMenu">
                            <img
                                src={user.picture || "/default_user.jpg"}
                                id="headerUserPicture"
                                alt="user picture"
                            />
                            <h3 className="button">
                                {user.first_name} {user.last_name}
                            </h3>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default FindUserResultList;
