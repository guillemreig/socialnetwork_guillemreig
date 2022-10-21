import ReactDOM from "react-dom";
import Welcome from "./components/Welcome/index.jsx";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("/user/id.json data:", data);
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            console.log("user loged in");
            // The loged in page
        }
    });
