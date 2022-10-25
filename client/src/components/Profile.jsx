// import { CloudWatchLogs } from "aws-sdk";
import { Component } from "react";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            picture: "",
            bio: "",
            editMode: false,
        };
        this.inputChange = this.inputChange.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    toggleEditMode() {
        console.log("toggleEditMode()");

        console.log("this.state", this.state);
        this.setState({
            editMode: !this.state.editMode,
        });
    }

    inputChange(e) {
        console.log("inputChange()");
        this.setState({ [e.target.name]: e.target.value });
    }

    componentDidMount() {
        console.log("componentDidMount()");

        console.log("this.props.user", this.props.user);

        for (const property in this.props.user) {
            this.setState({ [property]: this.props.user[property] });
        }

        // Testing
        //         this.setState({
        //             bio: `This is a test bio.
        // This should be the first paragraph of the bio, and it should be formated nicely, even if it takes more than two lines of text.
        // The second paragraph should be here, not before and definitely not after, even though it can be added later, but never before.
        // This is goodbye. THE END`,
        //         });
    }

    render() {
        return (
            <div className="overlay">
                <div className="formMenu">
                    <div id="cardDiv">
                        <div>
                            <img
                                id="picture"
                                src={this.state.picture || "default_user.jpg"}
                                alt="picture preview"
                            />
                            {!this.state.editMode && (
                                <div id="userInfo">
                                    <h2>
                                        {this.props.user.first_name}{" "}
                                        {this.props.user.last_name}
                                    </h2>
                                    <h4>{this.props.user.email}</h4>
                                    <h4>{this.props.user.created_at}</h4>
                                </div>
                            )}
                            {this.state.editMode && (
                                <form id="form">
                                    <input
                                        // onChange="setPicture"
                                        type="file"
                                        name="picture"
                                        required
                                    />

                                    <div className="centeredFlex">
                                        <input
                                            className="nameInput"
                                            type="text"
                                            name="first_name"
                                            placeholder="First name"
                                            value={this.state.first_name}
                                            onChange={this.inputChange}
                                            required
                                        />
                                        <input
                                            className="nameInput"
                                            type="text"
                                            name="last_name"
                                            placeholder="Last name"
                                            value={this.state.last_name}
                                            onChange={this.inputChange}
                                            required
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.inputChange}
                                        required
                                    />
                                </form>
                            )}
                        </div>
                        <div id="bioDiv">
                            <div>
                                <h3
                                    onClick={this.props.toggleProfile}
                                    id="xBtn"
                                    className="button"
                                >
                                    X
                                </h3>
                            </div>
                            <h3>Bio</h3>
                            {!this.state.editMode && (
                                <p>{this.props.user.bio}</p>
                            )}

                            {this.state.editMode && (
                                <textarea
                                    name="bio"
                                    id="textarea"
                                    cols="53"
                                    rows="18"
                                    onChange={this.inputChange}
                                    value={this.state.bio}
                                ></textarea>
                            )}

                            {this.state.editMode && (
                                <div className="centeredFlex">
                                    <button onClick={this.toggleEditMode}>
                                        Back
                                    </button>
                                    <button onClick={this.saveChanges}>
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {!this.state.editMode && (
                        <div className="centeredFlex">
                            <button onClick={this.toggleEditMode}>Edit</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

// export default function Profile({
//     first_name,
//     last_name,
//     email,
//     picture,
//     bio,
//     toggleProfile,
// }) {
//     return (
//         <div>
//             <h1>TEST TEXT</h1>
//             <button onClick={this.toggleProfile}></button>
//         </div>
//     );
// }
