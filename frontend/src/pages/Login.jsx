import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { getAccessToken, logout, saveAuth } from "../utils/auth";


function Login() {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await api.post(
                "login/",
                { mobile, password },
                { skipAuth: true }
            );

            saveAuth(response.data);

            const savedToken = getAccessToken();
            console.log("Saved token:", savedToken);

            if (!savedToken) {
                throw new Error("The access token could not be saved.");
            }

            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login failed:", error.response?.data ?? error);
            logout();

            if ([400, 401].includes(error.response?.status)) {
                setErrorMessage("Invalid mobile or password");
            } else {
                setErrorMessage("Unable to log in. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div>
            <h1>Patient Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    autoComplete="username"
                    required
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                />

                <br />

                {errorMessage && <p role="alert">{errorMessage}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}


export default Login;
