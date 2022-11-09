import { useEffect, useState } from "react";

function UserPage(props) {
    const [posts, setPosts] = useState([]);
    const [postMode, setPostMode] = useState(false);
    const [post, setPost] = useState({
        // title: "",
        // post_text: "",
        // image: null,
        // file: null,
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`/allposts/0.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);

                setPosts(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function togglePostMode() {
        setPostMode(!postMode);
    }

    function setFile(e) {
        if (e.target.files && e.target.files[0]) {
            // console.log(e.target.name);
            // console.log(e.target.files[0]);

            const file = e.target.files[0];

            // Image preview
            var reader = new FileReader();

            reader.onload = function (e) {
                setPost({
                    ...post,
                    image: e.target.result,
                    file: file,
                });
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function inputChange(e) {
        setPost({ ...post, [e.target.name]: e.target.value });
        console.log("post :", post);
    }

    function submitPost() {
        const { title, post_text, file } = post;

        if (!title || !post_text) {
            setMessage("Missing fields!");
        } else {
            const formData = new FormData();

            formData.append("file", file);
            formData.append("title", title);
            formData.append("post_text", post_text);

            fetch("/post", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data.success) {
                        console.log("data.post:", data.post);
                        setPosts([...posts, data.post]);
                        togglePostMode();
                        setPost({});
                    } else {
                        setMessage(data.message);
                        throw new Error("ADD POST FAILED");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <div className="userPage">
            <div className="sidebar">
                <div className="userCard">
                    <img
                        id="picture"
                        src={props.user.picture || "/default_user.jpg"}
                        alt=""
                    />
                    <div id="userInfo">
                        <h2>
                            {props.user.first_name} {props.user.last_name}
                        </h2>
                        <h4>{props.user.email}</h4>
                        <p>Member since:</p>
                        <h4>{props.user.created_at}</h4>
                        <p>{props.user.bio}</p>
                    </div>
                </div>
            </div>
            <div className="timeline">
                <h1> {props.user.first_name}&apos;s Timeline</h1>
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        {post.image && (
                            <img id="picture" src={post.image} alt="" />
                        )}
                        <div className="postBody">
                            <h3>
                                {post.title}{" "}
                                <span className="date">
                                    ({post.created_at})
                                </span>
                            </h3>
                            <p className="postText">{post.post_text}</p>
                            <div className="centeredFlex">
                                <button>Edit</button>
                                <button>Add comment</button>
                            </div>
                        </div>
                    </div>
                ))}
                {postMode && (
                    <div className="post">
                        <div className="columnFlex">
                            <img
                                id="picture"
                                src={post.image || "/default_image.jpg"}
                                alt="picture preview"
                            />
                            <input type="file" onChange={setFile} />
                        </div>
                        <div className="postBody">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={post.title}
                                onChange={inputChange}
                                required
                            />
                            <textarea
                                // id="bioTextarea"
                                name="post_text"
                                cols="53"
                                rows="11"
                                onChange={inputChange}
                                value={post.post_text}
                            ></textarea>
                            <p className="message">{message}</p>

                            <div className="centeredFlex">
                                <button onClick={togglePostMode}>Back</button>
                                <button onClick={submitPost}>Post</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="centeredFlex">
                    {!postMode && (
                        <button onClick={togglePostMode}>Add post</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserPage;
