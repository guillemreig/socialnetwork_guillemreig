import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            message: "",
            email: "",
            code: "",
            password: "",
            stage: "email",
        };
        this.inputChange = this.inputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.submitCode = this.submitCode.bind(this);
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
                    this.setState({ message: "", stage: "code" });
                } else {
                    this.setState({ message: data.message });
                    throw new Error("VERIFICATION FAILED");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    submitCode(e) {
        e.preventDefault();
        console.log("submitCode(). this.state:", this.state);

        fetch("/resetpassword", {
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
                    this.setState({ message: "", stage: "done" });
                } else {
                    this.setState({ message: data.message, stage: "email" });
                    throw new Error("PASSWORD RESET FAILED");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="formMenu">
                <h2>Password Reset</h2>
                {this.state.stage == "email" && (
                    <>
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
                        <Link to="/">Cancel</Link>
                    </>
                )}
                {this.state.stage == "code" && (
                    <>
                        <p>
                            Write the code received
                            <br></br> and the new password:
                        </p>
                        <p className="message">{this.state.message}</p>
                        <form onSubmit={this.formSubmit}>
                            <input
                                type="text"
                                name="code"
                                placeholder="code"
                                onChange={this.inputChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={this.inputChange}
                            />
                            <button onClick={this.submitCode}>Send</button>
                        </form>
                        <Link to="/">Back</Link>
                    </>
                )}
                {this.state.stage == "done" && (
                    <>
                        <p>Your password has been reset.</p>
                        <p>Log in with the new password.</p>
                        <Link to="/">Back to Log in</Link>
                    </>
                )}
            </div>
        );
    }
}
