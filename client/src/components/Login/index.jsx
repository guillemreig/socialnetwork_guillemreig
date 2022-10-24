import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            message: "",
            email: "",
            password: "",
        };
        this.inputChange = this.inputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    inputChange(e) {
        console.log("inputChange()");
        this.setState({ [e.target.name]: e.target.value });
    }

    submitForm(e) {
        e.preventDefault();
        console.log("submitForm(). this.state:", this.state);

        fetch("/login", {
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
                    location.reload();
                } else {
                    this.setState({ message: data.message });
                    throw new Error("LOG IN FAILED");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="formMenu">
                <h2>Log in</h2>
                <p>
                    Not a member?: <Link to="/signup">Sign up</Link>
                </p>
                <p className="message">{this.state.message}</p>
                <form onSubmit={this.formSubmit}>
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
                    <button onClick={this.submitForm}>Submit</button>
                </form>
                <Link to="/password">I forgot my password</Link>
            </div>
        );
    }
}
