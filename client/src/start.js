import ReactDOM from "react-dom";
import Welcome from "./components/Welcome/index.jsx";
import Home from "./components/Home/index.jsx";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("/user/id.json data:", data);
        if (!data.id) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("user loged in");
            ReactDOM.render(<Home />, document.querySelector("main"));
            // The loged in page
        }
    });
