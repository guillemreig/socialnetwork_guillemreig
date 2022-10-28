import { useState } from "react";

export default function useStatefulFields() {
    // Every hook function has to begin with the word 'use'
    const [values, setValues] = useState({});

    function handleChange(e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }

    return [values, handleChange];
}
