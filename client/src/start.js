import ReactDOM from "react-dom";
import Welcome from "./components/Welcome.jsx";
import Home from "./components/Home.jsx";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("/user/id.json data:", data);
        if (!data.id) {
            console.log("user NOT loged in");
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("user loged in");
            // The loged in page:
            ReactDOM.render(<Home />, document.querySelector("main"));
        }
    });
