// import { CloudWatchLogs } from "aws-sdk";
import { Component } from "react";

// Variables
const namesRegex = /^[a-z ,.'-]+$/i;
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

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
            file: "",
            editMode: false,
        };
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.setFile = this.setFile.bind(this);
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

    setFile(e) {
        console.log("setFile()");
        if (e.target.files && e.target.files[0]) {
            // Update 'newImage.file' value
            console.log("e.target.files[0]", e.target.files[0]);

            this.setState({ [e.target.name]: e.target.files[0] });

            // Image preview
            var reader = new FileReader();

            reader.onload = function (e) {
                this.setState({ picture: e.target.result });
            }.bind(this);

            reader.readAsDataURL(e.target.files[0]);
        }
    }

    submitForm() {
        console.log("saveChanges(). this.state:", this.state);

        const { file, first_name, last_name, email, bio } = this.state;

        if (
            // Check if empty fields
            !first_name ||
            !last_name ||
            !email
        ) {
            this.setState({ message: "Missing fields!" });
        } else if (
            // Check if valid input format
            !email.match(emailRegex) ||
            !first_name.match(namesRegex) ||
            !last_name.match(namesRegex)
        ) {
            this.setState({ message: "Invalid input!" });
        } else {
            const formData = new FormData();

            formData.append("file", file);
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("email", email);
            formData.append("bio", bio);

            fetch("/profile", {
                method: "POST",
                body: formData,
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
                <div className="window">
                    <div id="profileDiv">
                        <div>
                            {!this.state.editMode && (
                                <>
                                    <img
                                        id="picture"
                                        src={
                                            this.props.user.picture ||
                                            "/default_user.jpg"
                                        }
                                        alt="picture preview"
                                    />

                                    <div id="userInfo">
                                        <h2>
                                            {this.props.user.first_name}{" "}
                                            {this.props.user.last_name}
                                        </h2>
                                        <h4>{this.props.user.email}</h4>
                                        <h4>{this.props.user.created_at}</h4>
                                    </div>
                                </>
                            )}
                            {this.state.editMode && (
                                <>
                                    <img
                                        id="picture"
                                        src={
                                            this.state.picture ||
                                            "default_user.jpg"
                                        }
                                        alt="picture preview"
                                    />

                                    <form id="form">
                                        <input
                                            type="file"
                                            name="file"
                                            onChange={this.setFile}
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
                                </>
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
