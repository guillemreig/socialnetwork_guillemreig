// import { fireEvent, render, waitFor } from "@testing-library/react";

// import App from "./App";

// test("enders correctly without any props", () => {
//     const { container } = render(<App />);
//     expect(container.querySelector("div").innerHTML).toBe("Hello, React");
// });

// test("enders correctly with a prop passed", () => {
//     const { container } = render(<App gretee="Kitty" />);
//     expect(container.querySelector("div").innerHTML).toBe("Hello, Kitty");
// });

// test("It changes after button click", () => {
//     const { container } = render(<App gretee="Kitty" />);
//     expect(container.querySelector("div").innerHTML).toBe("Hello, Kitty");
//     // click the button
//     fireEvent.click(container.querySelector("button"));

//     // Expect it to be "Hello, React"
//     expect(container.querySelector("div").innerHTML).toBe("Hello, React");
// });

// test("Shows the greetee coming from the fetch request", async () => {
//     fetch.mockResolvedValueOnce({
//         async json() {
//             return {
//                 greetee: "Kitty",
//             };
//         },
//     });

//     const { container } = render(<App />);

//     expect(container.innerHTML).toContain("Loading...");

//     await waitFor(() => expect(container.querySelector("div")).toBeTruthy());

//     expect(container.querySelector("div")).innerHTML.toBe("Hello, Kitty");
// });
