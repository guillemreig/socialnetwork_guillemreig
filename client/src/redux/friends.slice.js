// slice file should contain reducer AND actions
const initialState = {
    friends: [],
};

// REDUCER:
export default function friendsReducer(friends = initialState.friends, action) {
    if (action.type === "friends/received") {
        console.log("action.payload.friends :", action.payload.friends);
        // return action.payload.friends;
        return action.payload.friends;
    }
    // else if (action.type === "friends/accept") {
    //     const newFriends =
    //         friends.map(/** do something with action.payload.id... */);
    //     return newFriends;
    // } else if (action.type === "friends/unfriend") {
    //     const newFriends =
    //         friends.map(/** do something with action.payload.id... */);
    //     return newFriends;
    // }
    return friends;
} // dispatch in component triggers this

// ACTIONS:
export function setFriends(friends) {
    return {
        type: "friends/received",
        payload: { friends },
    };
}

export function addFriend(id) {
    // return action object that gets passed to reducer
    id;
}

export function removeFriend(id) {
    // return action object that gets passed to reducer
    id;
}
