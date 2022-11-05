// SETUP
import { combineReducers } from "redux";

// Initial state
const initialState = {
    friends: [],
    messages: [
        {
            first_name: "Name",
            last_name: "Lastname",
            picture: "/default_user.jpg",
            text: "This is a text message.",
        },
    ],
};

// FRIENDS
// reducer:
function friendsReducer(friends = initialState.friends, action) {
    if (action.type === "friends/get") {
        // console.log("action.payload.friends :", action.payload.friends);
        return action.payload.friends;
    } else if (action.type === "friends/accept") {
        // console.log("action.payload.id :", action.payload.id);

        const index = friends.map((user) => user.id).indexOf(action.payload.id);
        // console.log("friends[index]", friends[index]);

        const newFriends = [...friends];
        newFriends[index].status = true;

        return newFriends;
    } else if (action.type === "friends/reject") {
        // console.log("action.payload.id :", action.payload.id);

        const index = friends.map((user) => user.id).indexOf(action.payload.id);
        // console.log("friends[index]", friends[index]);

        const newFriends = [...friends];
        newFriends.splice(index, 1);

        return newFriends;
    }

    // console.log("friends :", friends);
    return friends;
}

// actions:
export function getFriends(friends) {
    return {
        type: "friends/get",
        payload: { friends },
    };
}

export function acceptFriend(id) {
    return {
        type: "friends/accept",
        payload: { id },
    };
}

export function rejectFriend(id) {
    return {
        type: "friends/reject",
        payload: { id },
    };
}

// MESSAGES
function messagesReducer(messages = [], action) {
    // switch (action.type) {
    //     case "/messages/received-many":
    //         return [...messages, action.payload.messages];
    //         break;
    //     case "/messages/received-one":
    //         return action.payload.message;
    //         break;
    //     default:
    //         return messages;
    // }
    if (action.type == "messages/get") {
        // console.log("action.payload.messages :", action.payload.messages);
        return action.payload.messages;
    }

    // console.log("messages :", messages);
    return messages;
}

export function getMessages(messages) {
    return {
        type: "/messages/get",
        payload: { messages },
    };
}

// export function chatMessageReceived(message) {
//     return {
//         type: "/messages/received-one",
//         payload: { message },
//     };
// }

// ROOT REDUCER
const rootReducer = combineReducers({
    friends: friendsReducer,
    messages: messagesReducer,
});

export default rootReducer;
