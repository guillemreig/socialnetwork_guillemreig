// import { CloudWatchLogs } from "aws-sdk";
import { Component } from "react";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            first_name: "",
            last_name: "",
            email: "",
            picture: "",
            bio: "",
            editMode: false,
        };
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    toggleEditMode() {
        console.log("toggleEditMode()");

        this.setState({
            editMode: !this.state.editMode,
        });
    }

    inputChange(e) {
        console.log("inputChange()");
        this.setState({ [e.target.name]: e.target.value });
    }

    submitForm() {
        console.log("saveChanges(). this.state:", this.state);

        fetch("/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("data :", data);
                if (data.success) {
                    this.props.updateProfile(this.state);
                    // location.reload();
                } else {
                    this.setState({ message: data.message });
                    throw new Error("PROFILE EDIT FAILED");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        console.log("componentDidMount(). this.props.user :", this.props.user);

        for (const property in this.props.user) {
            this.setState({ [property]: this.props.user[property] });
        }
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
                                <p id="bio">{this.props.user.bio}</p>
                            )}

                            {this.state.editMode && (
                                <textarea
                                    name="bio"
                                    id="textarea"
                                    cols="53"
                                    rows="17"
                                    onChange={this.inputChange}
                                    value={this.state.bio}
                                ></textarea>
                            )}

                            {this.state.editMode && (
                                <>
                                    <p className="message">
                                        {this.state.message}
                                    </p>
                                    <div className="centeredFlex">
                                        <button onClick={this.toggleEditMode}>
                                            Back
                                        </button>
                                        <button onClick={this.submitForm}>
                                            Save
                                        </button>
                                    </div>
                                </>
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
