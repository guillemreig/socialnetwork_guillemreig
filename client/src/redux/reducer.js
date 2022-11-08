// REDUX SETUP
import { combineReducers } from "redux";

// Initial state
const initialState = {
    user: {},
    friends: [],
    newRequest: false,
    chatId: 0,
    messages: [],
};

// USER
// reducer:
function userReducer(user = initialState.user, action) {
    if (action.type == "/user/login") {
        return action.payload.user;
    } else if (action.type == "/user/edit") {
        // console.log("action.payload.user :", action.payload.user);
        return action.payload.user;
    } else if (action.type == "/user/logout") {
        return initialState.user;
    }

    return user;
}

// actions:
export function loginUser(user) {
    return {
        type: "/user/login",
        payload: { user },
    };
}

export function editUser(user) {
    // console.log("reducer editUser");
    return {
        type: "/user/edit",
        payload: { user },
    };
}

export function logoutUser() {
    return {
        type: "/user/logout",
        payload: { undefined },
    };
}

// FRIENDS
// reducer:
function friendsReducer(friends = initialState.friends, action) {
    if (action.type === "friends/get") {
        return action.payload.friends;
    } else if (action.type === "friends/accept") {
        const index = friends.map((user) => user.id).indexOf(action.payload.id);

        const newFriends = [...friends];
        newFriends[index].status = true;

        return newFriends;
    } else if (action.type === "friends/reject") {
        const index = friends.map((user) => user.id).indexOf(action.payload.id);

        const newFriends = [...friends];
        newFriends.splice(index, 1);

        return newFriends;
    } else if (action.type === "friends/online") {
        const index = friends.map((user) => user.id).indexOf(action.payload.id);

        const newFriends = [...friends];
        newFriends[index].online = true;

        return newFriends;
    } else if (action.type === "friends/offline") {
        const index = friends.map((user) => user.id).indexOf(action.payload.id);

        const newFriends = [...friends];
        newFriends[index].online = false;

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

export function friendOnline(id) {
    return {
        type: "friends/online",
        payload: { id },
    };
}

export function friendOffline(id) {
    return {
        type: "friends/offline",
        payload: { id },
    };
}

// FRIENDS NOTIFICATION
// reducer
function newRequestReducer(newRequest = initialState.newRequest, action) {
    if (action.type == "/newrequest/update") {
        return action.payload.newRequest;
    }

    return newRequest;
}

// actions
export function newRequestUpdate(newRequest) {
    return {
        type: "/newrequest/update",
        payload: { newRequest },
    };
}

// CHAT ID
// reducer
function chatIdReducer(chatId = initialState.chatId, action) {
    if (action.type == "/chatId/set") {
        return action.payload.chatId;
    }
    return chatId;
}

// actions
export function setChatId(chatId) {
    return {
        type: "/chatId/set",
        payload: { chatId },
    };
}

// MESSAGES
// reducer
function messagesReducer(messages = initialState.messages, action) {
    if (action.type == "/messages/reset") {
        return initialState.messages;
    } else if (action.type == "/messages/get") {
        return action.payload.messages;
    } else if (action.type == "/messages/add") {
        // Ideally only if the correct chat is active the message should be added to the message array
        // unfortunately I can't access chatId from here

        const newMessages = [...messages, action.payload.message];

        return newMessages;
    }
    return messages;
}

// actions
export function resetMessages() {
    return {
        type: "/messages/reset",
        payload: { undefined },
    };
}

export function getMessages(messages) {
    return {
        type: "/messages/get",
        payload: { messages },
    };
}

export function addMessage(message) {
    return {
        type: "/messages/add",
        payload: { message },
    };
}

// ROOT REDUCER

const rootReducer = combineReducers({
    user: userReducer,
    friends: friendsReducer,
    newRequest: newRequestReducer,
    chatId: chatIdReducer,
    messages: messagesReducer,
});

export default rootReducer;
