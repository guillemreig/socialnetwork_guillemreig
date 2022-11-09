import { useEffect, useState } from "react";

function Post(props) {
    const [responses, setResponses] = useState([
        {
            first_name: "Test",
            last_name: "Tester",
            response: "I agree!",
            created_at: "Yesterday",
        },
    ]);

    useEffect(() => {
        fetch(`/responses/${props.postId}.json`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("responses data :", data);
                setResponses(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            {responses.map((response) => (
                <div key={response.id}>
                    <h4 className="button">
                        {response.first_name} {response.last_name}
                    </h4>
                </div>
            ))}
        </>
    );
}

export default Post;
