import React from "react";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            message: "Was sent?",
            wasSent: false,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(e) {
        e.preventDefault();
        this.setState({
            wasSent: true,
        });
        console.log("submitForm(e)!", e);
    }

    render() {
        return (
            <>
                <h2>Registration Component</h2>
                <form>
                    <span>{this.state.message}</span>
                    <span>{this.state.wasSent}</span>
                    <label className="" htmlFor="email">
                        Email
                    </label>
                    <input type="email" name="email" id="" />
                    <button onClick={this.submitForm}>Register</button>
                </form>
            </>
        );
    }
}
