import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import { getAccessToken, logout, saveAuth } from "../utils/auth";
import styles from "./Login.module.css";


function Login() {

    const navigate = useNavigate();

    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);



    const handleLogin = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        setIsSubmitting(true);


        try {

            const response = await api.post(

                "login/",

                {
                    mobile,
                    password
                },

                {
                    skipAuth: true
                }

            );


            saveAuth(response.data);


            const savedToken = getAccessToken();


            console.log("Saved token:", savedToken);



            if (!savedToken) {

                throw new Error(
                    "The access token could not be saved."
                );

            }



            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );


        }

        catch (error) {


            console.error(
                "Login failed:",
                error.response?.data ?? error
            );


            logout();



            if (
                [400,401].includes(
                    error.response?.status
                )
            ) {

                setErrorMessage(
                    "Invalid mobile or password"
                );

            }

            else {

                setErrorMessage(
                    "Unable to log in. Please try again."
                );

            }

        }


        finally {

            setIsSubmitting(false);

        }


    };



    return (

        <AuthLayout>
            <div className={`${styles.loginCard} motion-fade-up`}>
                <div className={styles.brand}>
                    <span className={styles.brandMark} aria-hidden="true">
                        <svg viewBox="0 0 40 40" focusable="false">
                            <path d="M20 4.5C11.44 4.5 4.5 11.44 4.5 20S11.44 35.5 20 35.5 35.5 28.56 35.5 20 28.56 4.5 20 4.5Z" />
                            <path d="M20 11.25v17.5M11.25 20h17.5" />
                        </svg>
                    </span>

                    <span className={styles.brandText}>
                        <strong>AEQUISYM</strong>
                        <small>Patient management</small>
                    </span>
                </div>

                <header className={styles.header}>
                    <h1 className={styles.title}>Welcome back</h1>

                    <p className={styles.intro}>
                        Sign in with your registered mobile number to continue
                        to your patient workspace.
                    </p>
                </header>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="mobile">
                            Mobile number
                        </label>

                        <input
                            className={styles.input}
                            id="mobile"
                            name="mobile"
                            type="tel"
                            inputMode="tel"
                            placeholder="01XXXXXXXXX"
                            aria-describedby="mobile-hint"
                            value={mobile}
                            onChange={
                                (event) =>
                                setMobile(event.target.value)
                            }
                            autoComplete="username"
                            required
                        />

                        <p className={styles.fieldHint} id="mobile-hint">
                            Use the number connected to your patient account.
                        </p>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">
                            Password
                        </label>

                        <div className={styles.passwordControl}>
                            <input
                                className={styles.passwordInput}
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={
                                    (event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />

                            <button
                                className={styles.passwordToggle}
                                type="button"
                                aria-label={
                                    showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                    <circle cx="12" cy="12" r="2.75" />
                                </svg>

                                <span>{showPassword ? "Hide" : "Show"}</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.errorSlot}>
                        {errorMessage && (
                            <p className={styles.errorMessage} role="alert">
                                <svg
                                    className={styles.errorIcon}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 7.75v5.5M12 16.5v.1" />
                                </svg>

                                <span>{errorMessage}</span>
                            </p>
                        )}
                    </div>

                    <button
                        className={styles.submitButton}
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting && (
                            <span className={styles.spinner} aria-hidden="true" />
                        )}

                        <span>
                            {isSubmitting ? "Logging in..." : "Sign in"}
                        </span>
                    </button>
                </form>
            </div>
        </AuthLayout>

    );

}


export default Login;
