// First slice (file containing a reducer, the related actions, and the related action creators

// initial state
// contains usually all the default/empty values
const initialState = {
    allColors: [],
};

// redux action
// it takes some params
// returns an object with 2 entries: type (string), payload (object)
export function receiveColors(colors) {
    return {
        type: "colors/receive",
        payload: { colors },
    };
}

export function likeColor(colorName) {
    return {
        type: "colors/likeColor",
        payload: colorName,
    };
}

// the reducer is a function
// takes the old state and the incoming action
// and returns the new state
export default function reducer(state = initialState, action) {
    // check if the incoming action interests this reducer
    if (action.type === "colors/receive") {
        return {
            ...state, // keep the existing state intact
            allColors: action.payload.colors,
        };
    } else if (action.type === "colors/likeColor") {
        return {
            ...state,
            likedColors: [...state.likedColors, action.payload.colorName],
        };
    } else if (action.type === "colors/unlikeColor") {
        return {
            ...state,
            likedColors: state.likedColors.filter(
                (color) => color !== action.payload.colorName
            ),
        };
    }
    // default case - no action intercepted
    return state;
}
