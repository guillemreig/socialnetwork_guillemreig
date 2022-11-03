// First slice (file containing a reducer, the related actions, and the related action creators
import { combineReducers } from "redux";
import friendsReducer from "./friends.slice.js";

const rootReducer = combineReducers({
    friends: friendsReducer,
});

export default rootReducer;

// // initial state
// // contains usually all the default/empty values
// const initialState = {
//     friends: [],
// };

// // redux action
// // it takes some params
// // returns an object with 2 entries: type (string), payload (object)
// export function receiveFriends(friends) {
//     return {
//         type: "friends/receive",
//         payload: { friends },
//     };
// }

// // export function acceptFriend(friend) {
// //     return {
// //         type: "friends/acceptFriend",
// //         payload: friend,
// //     };
// // }

// // the reducer is a function
// // takes the old state and the incoming action
// // and returns the new state
// function friendsReducer(state = initialState, action) {
//     // check if the incoming action interests this reducer
//     if (action.type === "friends/receive") {
//         return {
//             ...state, // keep the existing state intact
//             friends: action.payload.friends,
//         };
//     }
//     // default case - no action intercepted
//     return state;
// }
