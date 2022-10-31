import ReactDOM from "react-dom";
import Welcome from "./components/Welcome/Welcome.jsx";
import Home from "./components/Home/Home.jsx";
import { BrowserRouter } from "react-router-dom";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.id) {
            ReactDOM.render(
                <BrowserRouter>
                    <Welcome />
                </BrowserRouter>,
                document.querySelector("main")
            );
        } else {
            ReactDOM.render(
                <BrowserRouter>
                    <Home />
                </BrowserRouter>,
                document.querySelector("main")
            );
        }
    });
