import { useState } from "react";

import SearchUserResultList from "./SearchUserResultList.jsx";

let timer; // Stored in the global scope so it survives

function SearchUser() {
    const [searchString, setSearchString] = useState("");
    const [resultList, setResultList] = useState(false);
    const [users, setUsers] = useState([]);

    function inputChange(e) {
        console.log("inputChange(e) :", e.target.value);

        setSearchString(e.target.value);

        if (e.target.value == "") {
            console.log("here!");
            setUsers([]);
            return;
        }

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
            />
            {resultList && (
                <SearchUserResultList
                    users={users}
                    setResultList={setResultList}
                />
            )}
        </div>
    );
}

export default SearchUser;
