import { useEffect, useState } from "react";
import { socket } from "../../../socket.js";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../../../redux/reducer.js";

function Chat() {
    const [chat, setChat] = useState(false);
    const [chatId, setChatId] = useState(0);
    const [text, setText] = useState("");

    const messages = useSelector((state) => state.messages);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Chat useEffect(). chatId:", chatId);
        fetch(`/messages/${chatId}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("Chat data", data);

                data && dispatch(getMessages(data));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [chatId]);

    function toggleChat() {
        console.log("toggleChat()");

        setChat(!chat);
    }

    function inputChange(e) {
        console.log("inputChange()");
        setText(e.target.value);
    }

    function sendMessage() {
        console.log("sendMessage()");

        if (text.trim() !== "") {
            socket.emit("sendMessage", {
                chatId: chatId,
                text: text.trim(),
            }); // jump to socket.js
            setText("");
        }
    }

    return (
        <div className="chatDiv">
            {!chat && (
                <div className="logMenu">
                    <h3 className="button" onClick={toggleChat}>
                        Messages
                    </h3>
                </div>
            )}
            {chat && (
                <div className="window">
                    <div className="bioDiv">
                        <div>
                            <h3
                                onClick={toggleChat}
                                id="xBtn"
                                className="button"
                            >
                                X
                            </h3>
                        </div>
                        <h3>Chat</h3>
                        <div id="chatFeed">
                            {messages.map((message) => (
                                <div
                                    key={message.first_name}
                                    className="logMenu"
                                >
                                    <img
                                        id="headerUserPicture"
                                        src={message.picture}
                                        alt=""
                                    />
                                    <h4>
                                        {message.first_name} {message.last_name}
                                    </h4>
                                    <p>{message.text}</p>
                                </div>
                            ))}
                        </div>
                        <textarea
                            name=""
                            id=""
                            cols="50"
                            rows="2"
                            onChange={inputChange}
                            value={text}
                        ></textarea>
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
