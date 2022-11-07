import React from "react";
import { Link } from "react-router-dom";

// Variables
const namesRegex = /^[a-z ,.'-]+$/i;
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            message: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        };
        this.message = "";
        this.inputChange = this.inputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    inputChange(e) {
        // console.log("inputChange()");
        this.setState({ [e.target.name]: e.target.value });
    }

    submitForm(e) {
        e.preventDefault();
        // console.log("submitForm(). this.state:", this.state);

        if (
            // Check if empty fields
            !this.state.firstName ||
            !this.state.lastName ||
            !this.state.email ||
            !this.state.password
        ) {
            this.setState({ message: "Missing fields!" });
        } else if (
            // Check if valid input format
            !this.state.email.match(emailRegex) ||
            !this.state.firstName.match(namesRegex) ||
            !this.state.lastName.match(namesRegex)
        ) {
            this.setState({ message: "Invalid input format!" });
        } else {
            fetch("/registration", {
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
                    // console.log("data :", data);
                    if (data.success) {
                        history.pushState({}, "", `/`);
                        location.reload();
                    } else {
                        this.setState({ message: data.message });
                        throw new Error("REGISTRATION FAILED");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        return (
            <div className="window">
                <h2>Registration</h2>
                <p>
                    Already a member?: <Link to="/">Log in</Link>
                </p>
                <p className="message">{this.state.message}</p>
                <form onSubmit={this.formSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        onChange={this.inputChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        onChange={this.inputChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={this.inputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.inputChange}
                    />
                    <button onClick={this.submitForm}>Sign up</button>
                </form>
            </div>
        );
    }
}
