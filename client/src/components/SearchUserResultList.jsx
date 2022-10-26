function FindUserResultList({ users }) {
    return (
        <div id="resultList" className="formMenu">
            {users.map((user) => (
                <div className="logMenu" key={user.first_name}>
                    <img
                        src={user.picture || "default_user.jpg"}
                        id="headerUserPicture"
                        alt="user picture"
                    />
                    <h3 className="button">
                        {user.first_name} {user.last_name}
                    </h3>
                </div>
            ))}
        </div>
    );
}

export default FindUserResultList;
