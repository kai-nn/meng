import React from "react";

const InputField = ({text, handleInput, handleSubmit}) => {
    return (
        <label>
            <input  value={text}
                    onChange={(e) => handleInput(e.target.value)} />
            <button onClick={handleSubmit}>Add todo</button>
        </label>
    )
}

export default InputField