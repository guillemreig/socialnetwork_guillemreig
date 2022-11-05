import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import Welcome from "./components/Welcome/Welcome.jsx";
import Home from "./components/Home/Home.jsx";

// REDUX
import rootReducer from "./redux/reducer.js";
import { Provider } from "react-redux";
import { createStore } from "redux";

// socket.io
import { initSocket } from "./socket.js";

const store = createStore(rootReducer);

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (data.id) {
            // Set up socket
            initSocket(store);
            ReactDOM.render(
                <Provider store={store}>
                    <BrowserRouter>
                        <Home />
                    </BrowserRouter>
                </Provider>,
                document.querySelector("main")
            );
        } else {
            ReactDOM.render(
                <BrowserRouter>
                    <Welcome />
                </BrowserRouter>,
                document.querySelector("main")
            );
        }
    });
