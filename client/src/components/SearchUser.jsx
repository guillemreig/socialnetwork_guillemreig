import { useState } from "react";

import SearchUserResultList from "./SearchUserResultList.jsx";

function SearchUser() {
    const [searchString, setSearchString] = useState("");
    const [resultList, setResultList] = useState(false);

    const users = [
        { first_name: "Bob", last_name: "Dylan" },
        { first_name: "Jeb", last_name: "Kerman", picture: "default_user.jpg" },
        { first_name: "Alice", last_name: "Wond", picture: "default_user.jpg" },
    ]; // Fake user list

    function getUsers(searchString) {
        if (searchString === "") {
            return users;
        } else {
            return users.filter((user) => {
                return user.first_name
                    .toLowerCase()
                    .startsWith(searchString.toLowerCase());
            });
        }
    }

    function inputChange(e) {
        console.log("inputChange(e)");

        setSearchString(e.target.value);
    }

    return (
        <div id="searchUserDiv">
            <input
                className="input"
                type="text"
                name="search"
                placeholder="Search User"
                value={searchString}
                onChange={inputChange}
                onFocus={() => setResultList(true)}
                onBlur={() => setResultList(false)}
            />
            {resultList && (
                <SearchUserResultList users={getUsers(searchString)} />
            )}
        </div>
    );
}

export default SearchUser;

// function SearchUser({ defaultInput }) {
//     const [searchString, setSearchInput] = useState(defaultInput);
//     // const [showText, setShowText] = useState(true);
//     const [user, setUser] = useState({
//         name: "Sven",
//         isLoggedIn: true,
//         userGroup: "user",
//     });

//     function updateInput(e) {
//         setSearchInput(e.target.value);
//     }

//     useEffect(() => {
//         console.log("useEffect(). Component mounted!");

//         return () => {
//             console.log("useEffect(). Component is unmounted!");
//         };
//     }, [user]); // Hook (runs when the component mounts)
//     // adding [user] makes the function run every time the user is changed

//     return (
//         <>
//             <input
//                 className="input"
//                 type="text"
//                 name="search"
//                 placeholder={searchString}
//                 onChange={updateInput}
//             />
//             {/* <p>{showText ? "true" : "false"}</p> */}
//             <p>
//                 User:
//                 {user.name}, {user.userGroup},{" "}
//                 {user.isLoggedIn ? "true" : "false"}
//             </p>
//             <button onClick={() => setUser({ ...user, isLoggedIn: false })}>
//                 setUser
//             </button>
//         </>
//     );
// }

// export default SearchUser;
