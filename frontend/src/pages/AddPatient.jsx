import { useState } from "react";

import api from "../api/axios";
import SelectField from "../components/ui/SelectField";
import styles from "./AddPatient.module.css";


const EMPTY_PATIENT = {
    first_name: "",
    last_name: "",
    mobile: "",
    age: "",
    gender: "MALE",
    address: "",
    blood_group: "",
    password: "",
};

const GENDER_OPTIONS = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
];


function AddPatient() {
    const [patient, setPatient] = useState(EMPTY_PATIENT);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setPatient({
            ...patient,
            [event.target.name]: event.target.value,
        });
    };

    const addPatient = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            await api.post(
                "/patients/",
                patient,
            );

            setPatient(EMPTY_PATIENT);
            setFeedback({
                type: "success",
                message: "Patient added successfully.",
            });
        } catch (error) {
            console.log(error);
            setFeedback({
                type: "error",
                message: "The patient could not be added. Review the details and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <article className={styles.registration} aria-labelledby="add-patient-title">
            <header className={styles.introduction}>
                <span className={styles.eyebrow}>Patient registration</span>
                <h2 id="add-patient-title">Add new patient</h2>
                <p>
                    Create a patient record with essential personal and medical
                    information.
                </p>
            </header>

            <form
                className={styles.formSurface}
                onSubmit={addPatient}
                aria-busy={isSubmitting}
            >
                <section
                    className={styles.formSection}
                    aria-labelledby="personal-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 01</span>
                        <h3 id="personal-information-title">Personal information</h3>
                        <p>Basic identity and contact details.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <label htmlFor="first-name">First name</label>
                            <input
                                id="first-name"
                                name="first_name"
                                type="text"
                                autoComplete="given-name"
                                placeholder="Enter first name"
                                value={patient.first_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="last-name">Last name</label>
                            <input
                                id="last-name"
                                name="last_name"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Enter last name"
                                value={patient.last_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="mobile">Mobile number</label>
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder="Enter mobile number"
                                value={patient.mobile}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="age">Age</label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                inputMode="numeric"
                                placeholder="Enter age"
                                value={patient.age}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="medical-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 02</span>
                        <h3 id="medical-information-title">Medical information</h3>
                        <p>Core demographic and clinical references.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <SelectField
                            id="gender"
                            name="gender"
                            label="Gender"
                            value={patient.gender}
                            options={GENDER_OPTIONS}
                            onChange={handleChange}
                        />

                        <SelectField
                            id="blood-group"
                            name="blood_group"
                            label="Blood group"
                            value={patient.blood_group}
                            options={BLOOD_GROUP_OPTIONS}
                            placeholder="Select blood group"
                            onChange={handleChange}
                        />
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="contact-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 03</span>
                        <h3 id="contact-information-title">Contact information</h3>
                        <p>Primary residential or contact address.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                autoComplete="street-address"
                                placeholder="Enter patient address"
                                value={patient.address}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="account-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 04</span>
                        <h3 id="account-information-title">Account information</h3>
                        <p>Create the patient&apos;s initial access credential.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.passwordControl}>
                                <input
                                    className={styles.passwordInput}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Enter a password"
                                    value={patient.password}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    className={styles.passwordToggle}
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
                    </div>
                </section>

                <footer className={styles.formFooter}>
                    <div className={styles.feedback} aria-live="polite">
                        {feedback && (
                            <p
                                className={
                                    feedback.type === "success"
                                        ? styles.successMessage
                                        : styles.errorMessage
                                }
                                role={feedback.type === "error" ? "alert" : "status"}
                            >
                                <span aria-hidden="true" />
                                {feedback.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <span className={styles.spinner} aria-hidden="true" />
                        )}
                        <span>{isSubmitting ? "Adding patient…" : "Add patient"}</span>
                    </button>
                </footer>
            </form>
        </article>
    );
}


export default AddPatient;
