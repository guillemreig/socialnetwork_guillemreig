import { io } from "socket.io-client";
import { chatMessagesReceived } from "./redux/reducer.js";

export let socket;

export const initSocket = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("newMessage", (data) => {
            console.log("newMessage data:", data);

            // add the messages to the redux store
            // store.dispatch(chatMessagesReceived(data.messages));
        });

        // socket.on("chatMessage", (data) => {
        //     // add the message to the redux store
        // });
    }
};
