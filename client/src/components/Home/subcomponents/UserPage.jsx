function UserPage(props) {
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
                        <p>Member since:</p>
                        <h4>{props.user.created_at}</h4>
                        <p>{props.user.bio}</p>
                    </div>
                </div>
            </div>
            <div className="timeline">
                <h1>OWN USER COMPONENT</h1>
            </div>
        </div>
    );
}

export default UserPage;
