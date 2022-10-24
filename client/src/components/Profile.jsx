export default function Profile({ userName, togglePopup }) {
    userName = userName || "default user name";
    return (
        <div>
            <button onClick={togglePopup}>
                <img src={userName} alt="..." />
            </button>
        </div>
    );
}
