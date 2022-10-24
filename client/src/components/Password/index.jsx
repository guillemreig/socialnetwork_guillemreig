import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            message: "",
            email: "",
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

        fetch("/getcode", {
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
                    throw new Error("VERIFICATION FAILED");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="formMenu">
                <h2>Reset Password</h2>
                <p>
                    Write your email to get
                    <br></br> the reset code:
                </p>
                <p className="message">{this.state.message}</p>
                <form onSubmit={this.formSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={this.inputChange}
                    />
                    <button onClick={this.submitForm}>Send</button>
                </form>
                <Link to="/">I remember now!</Link>
            </div>
        );
    }
}
