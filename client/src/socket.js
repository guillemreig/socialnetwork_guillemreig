import { io } from "socket.io-client";

export let socket;

// Redux
import { addMessage } from "./redux/reducer.js";

export const initSocket = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("newMessage", (data) => {
            console.log("newMessage data:", data);

            store.dispatch(addMessage(data));

            // add the messages to the redux store
            // store.dispatch(chatMessagesReceived(data.messages));
        });

        // socket.on("chatMessage", (data) => {
        //     // add the message to the redux store
        // });
    }
};
