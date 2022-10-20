import ReactDOM from "react-dom";
import Welcome from "./components/Welcome/index.jsx";

// ReactDOM.render(<HelloWorld />, document.querySelector("main"));

ReactDOM.render(<Welcome />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }

// fetch("/user/id.json")
//     .then((response) => response.json())
//     .then((data) => {
//         if (!data.userId) {
//             ReactDOM.render(<Welcome />, document.querySelector("main"));
//         } else {
//             ReactDOM.render(
//                 <img src="/logo.gif" alt="logo" />,
//                 document.querySelector("main")
//             );
//         }
//     });
