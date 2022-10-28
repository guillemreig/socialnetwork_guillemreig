// export default function useAuthSubmit(url) {
//     const [error, setError] = function onFormSubmit(e) {
//         fetch(url, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(values),
//         })
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 console.log("data :", data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     return [error, onFormSubmit];
// }
