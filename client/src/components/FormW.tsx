import { useState } from "react";
import React from "react";

const Form = () => {
    const [city, setCity] = useState[""];

    return (
        <div className="container">
            <form onSubmit={onsubmit}>
                <div className="input-group mb-3 mx-auto">
                    <input type="text" className="form-control" placeholder="city" onChange={(e) => setCity.target.value} />
                    <button className="btn btn-primary input-group-text" type="submit"></button>
                </div>
            </form>
        </div>
    ):
}

export default Form