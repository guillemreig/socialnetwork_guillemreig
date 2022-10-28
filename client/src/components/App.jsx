// import React from "react";

// class App extends React.Component {
//     Constructor(props) {
//         super(props);
//         this.state = {
//             greetee: props.greetee,
//         };
//     }

//     // We fetch some data

//     componentDidMount() {
//         fetch("/greetee")
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 this.setState(data);
//             });
//     }

//     // useEffect(()=>{
//     //     return () => {
//     //         second
//     //     }
//     // }, [])

//     render() {
//         if (this.state.greetee) {
//             return (
//                 <>
//                     <div>Hello, {this.props.greetee || "React"}</div>
//                     <button
//                         onClick={() => {
//                             this.setState({ greetee: null });
//                         }}
//                     ></button>
//                 </>
//             );
//         } else {
//             return (
//                 <>
//                     <h1>Loading...</h1>
//                 </>
//             );
//         }
//     }
// }

// export default App;
