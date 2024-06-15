import { useState, ChangeEvent } from "react";

export default function useFormInput(initialValue: unknown) {

    const [value, setValue] = useState(initialValue);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.currentTarget.value);
    }

    const inputProps = {
        value: value,
        onChange: handleChange,
    };

    return inputProps;
}

