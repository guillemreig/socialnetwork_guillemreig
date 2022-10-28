import ReactDOM from "react-dom";
import Welcome from "./components/Welcome/Welcome.jsx";
import Home from "./components/Home/Home.jsx";
import { BrowserRouter } from "react-router-dom";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("/user/id.json data:", data);
        if (!data.id) {
            console.log("START. user NOT loged in");
            ReactDOM.render(
                <BrowserRouter>
                    <Welcome />
                </BrowserRouter>,
                document.querySelector("main")
            );
        } else {
            console.log("START. user loged in");
            // The loged in page:
            ReactDOM.render(
                <BrowserRouter>
                    <Home />
                </BrowserRouter>,
                document.querySelector("main")
            );
        }
    });
