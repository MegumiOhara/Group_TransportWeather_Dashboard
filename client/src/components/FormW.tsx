import { useState } from "react";

interface FormWProps {
    newLocation: (city: string) => void; // Tipo para la prop newLocation
}

const FormW = ({ newLocation }: FormWProps) => {
    const [city, setCity] = useState<string>(""); // Estado tipado como string

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("City submitted:", city);
        if (!city) return; // Comprobación simplificada

        newLocation(city); // Llama a la función newLocation con el valor de city
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <div className="input-group mb-3 mx-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="city"
                        onChange={(e) => setCity(e.target.value)} // take the change of the entrance
                    />
                    <button className="btn btn-primary input-group-text" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormW;
