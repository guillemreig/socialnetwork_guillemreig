import { useState } from "react";

import SearchUserResultList from "./SearchUserResultList.jsx";

let timer; // Stored in the global scope so it survives

function SearchUser() {
    const [searchString, setSearchString] = useState("");
    const [resultList, setResultList] = useState(false);
    const [users, setUsers] = useState([]);

    // const fakeUsers = [
    //     { first_name: "Bob", last_name: "Dylan" },
    //     { first_name: "Jeb", last_name: "Kerman", picture: "default_user.jpg" },
    //     { first_name: "Alice", last_name: "Wond", picture: "default_user.jpg" },
    // ]; // Fake user list

    function getUsers(searchString) {
        if (searchString === "") {
            return [];
        } else {
            return users.filter((user) => {
                const searchArr = searchString.split(" ");
                console.log("searchArr :", searchArr);

                if (searchArr.length > 1) {
                    return (
                        user.first_name
                            .toLowerCase()
                            .startsWith(searchArr[0].toLowerCase()) &&
                        user.last_name
                            .toLowerCase()
                            .startsWith(searchArr[1].toLowerCase())
                    );
                } else {
                    return (
                        user.first_name
                            .toLowerCase()
                            .startsWith(searchArr[0].toLowerCase()) ||
                        user.last_name
                            .toLowerCase()
                            .startsWith(searchArr[0].toLowerCase())
                    );
                }
            });
        }
    }

    function inputChange(e) {
        console.log("inputChange(e)");
        console.log(e.target.value);

        setSearchString(e.target.value);

        clearTimeout(timer);

        timer = setTimeout(() => {
            let searchString = e.target.value;
            fetch(`/users/${searchString}`)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log("data :", data);
                    setUsers(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 250);
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
                // onBlur={() => setResultList(false)}
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
