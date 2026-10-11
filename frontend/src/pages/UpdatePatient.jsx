import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";
import SelectField from "../components/ui/SelectField";
import styles from "./UpdatePatient.module.css";


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

const FIELD_LABELS = {
    first_name: "First name",
    last_name: "Last name",
    mobile: "Mobile number",
    age: "Age",
    gender: "Gender",
    blood_group: "Blood group",
    address: "Address",
    password: "Password",
};


function getPatientName(patient) {
    const fullName = [patient?.first_name, patient?.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Selected patient";
}


function getErrorDetails(error) {
    const responseData = error.response?.data;

    if (!responseData) {
        return {
            fields: {},
            message: "The patient record could not be updated. Please try again.",
        };
    }

    if (typeof responseData === "string") {
        return {
            fields: {},
            message: responseData,
        };
    }

    const fields = {};
    const messages = [];

    Object.entries(responseData).forEach(([field, detail]) => {
        const message = Array.isArray(detail)
            ? detail.join(" ")
            : String(detail);
        const label = FIELD_LABELS[field] || "Patient record";

        fields[field] = message;
        messages.push(`${label}: ${message}`);
    });

    return {
        fields,
        message: messages.join(" ")
            || "The patient record could not be updated. Please try again.",
    };
}


function UpdatePatient() {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient;

    const [formData, setFormData] = useState(() => ({
        first_name: patient?.first_name ?? "",
        last_name: patient?.last_name ?? "",
        mobile: patient?.mobile ?? "",
        age: patient?.age ?? "",
        gender: patient?.gender ?? "MALE",
        address: patient?.address ?? "",
        blood_group: patient?.blood_group ?? "",
    }));
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const clearFieldError = (fieldName) => {
        setFieldErrors((currentErrors) => {
            if (!currentErrors[fieldName]) {
                return currentErrors;
            }

            const nextErrors = { ...currentErrors };
            delete nextErrors[fieldName];
            return nextErrors;
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
        clearFieldError(name);
        setFeedback(null);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        clearFieldError("password");
        setFeedback(null);
    };

    const updatePatient = async (event) => {
        event.preventDefault();

        if (!patient || isSubmitting) {
            return;
        }

        const requiredFieldErrors = {};

        if (!formData.gender) {
            requiredFieldErrors.gender = "Select a gender.";
        }

        if (!formData.blood_group) {
            requiredFieldErrors.blood_group = "Select a blood group.";
        }

        if (Object.keys(requiredFieldErrors).length > 0) {
            setFieldErrors(requiredFieldErrors);
            setFeedback({
                type: "error",
                message: "Review the highlighted fields before updating this patient.",
            });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);
        setFieldErrors({});

        const updatePayload = {
            ...patient,
            ...formData,
            ...(password !== "" ? { password } : {}),
        };

        try {
            await api.put(
                `/patients/${patient.id}/`,
                updatePayload,
            );

            setFeedback({
                type: "success",
                message: "Patient record updated successfully. Returning to the directory…",
            });

            await new Promise((resolve) => window.setTimeout(resolve, 650));
            navigate("/patients");
        } catch (error) {
            console.log(error.response?.data || error);

            const errorDetails = getErrorDetails(error);
            setFieldErrors(errorDetails.fields);
            setFeedback({
                type: "error",
                message: errorDetails.message,
            });
            setIsSubmitting(false);
        }
    };

    if (!patient) {
        return (
            <section className={styles.missingState} aria-labelledby="missing-patient-title">
                <span className={styles.eyebrow}>Patient update</span>
                <h1 id="missing-patient-title">Select a patient to update</h1>
                <p>
                    Return to the patient directory and choose the record you want to edit.
                </p>
                <button type="button" onClick={() => navigate("/patients")}>Back to patients</button>
            </section>
        );
    }

    return (
        <article className={styles.updatePage} aria-labelledby="update-patient-title">
            <header className={styles.introduction}>
                <div>
                    <span className={styles.eyebrow}>Patient record update</span>
                    <h1 id="update-patient-title">Update patient details</h1>
                    <p>
                        Review and update essential personal, medical, and contact
                        information for {getPatientName(patient)}.
                    </p>
                </div>

                <div className={styles.patientReference}>
                    <span>Patient ID</span>
                    <strong>#{patient.id}</strong>
                </div>
            </header>

            <form
                className={styles.formSurface}
                onSubmit={updatePatient}
                aria-busy={isSubmitting}
            >
                <section
                    className={styles.formSection}
                    aria-labelledby="update-personal-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 01</span>
                        <h2 id="update-personal-information-title">Personal information</h2>
                        <p>Confirm the patient&apos;s identity and primary contact number.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <label htmlFor="update-first-name">First name</label>
                            <input
                                id="update-first-name"
                                name="first_name"
                                type="text"
                                autoComplete="given-name"
                                value={formData.first_name}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.first_name)}
                                aria-describedby={fieldErrors.first_name ? "update-first-name-error" : undefined}
                                required
                            />
                            {fieldErrors.first_name && (
                                <p className={styles.fieldError} id="update-first-name-error">
                                    {fieldErrors.first_name}
                                </p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="update-last-name">Last name</label>
                            <input
                                id="update-last-name"
                                name="last_name"
                                type="text"
                                autoComplete="family-name"
                                value={formData.last_name}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.last_name)}
                                aria-describedby={fieldErrors.last_name ? "update-last-name-error" : undefined}
                            />
                            {fieldErrors.last_name && (
                                <p className={styles.fieldError} id="update-last-name-error">
                                    {fieldErrors.last_name}
                                </p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="update-mobile">Mobile number</label>
                            <input
                                id="update-mobile"
                                name="mobile"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.mobile)}
                                aria-describedby={fieldErrors.mobile ? "update-mobile-error" : undefined}
                                required
                            />
                            {fieldErrors.mobile && (
                                <p className={styles.fieldError} id="update-mobile-error">
                                    {fieldErrors.mobile}
                                </p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="update-age">Age</label>
                            <input
                                id="update-age"
                                name="age"
                                type="number"
                                inputMode="numeric"
                                value={formData.age}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.age)}
                                aria-describedby={fieldErrors.age ? "update-age-error" : undefined}
                                required
                            />
                            {fieldErrors.age && (
                                <p className={styles.fieldError} id="update-age-error">
                                    {fieldErrors.age}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="update-medical-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 02</span>
                        <h2 id="update-medical-information-title">Medical information</h2>
                        <p>Maintain core demographic and clinical references.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={styles.selectGroup}>
                            <SelectField
                                id="update-gender"
                                name="gender"
                                label="Gender"
                                value={formData.gender}
                                options={GENDER_OPTIONS}
                                onChange={handleChange}
                            />
                            {fieldErrors.gender && (
                                <p className={styles.fieldError} role="alert">
                                    {fieldErrors.gender}
                                </p>
                            )}
                        </div>

                        <div className={styles.selectGroup}>
                            <SelectField
                                id="update-blood-group"
                                name="blood_group"
                                label="Blood group"
                                value={formData.blood_group}
                                options={BLOOD_GROUP_OPTIONS}
                                placeholder="Select blood group"
                                onChange={handleChange}
                            />
                            {fieldErrors.blood_group && (
                                <p className={styles.fieldError} role="alert">
                                    {fieldErrors.blood_group}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="update-contact-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 03</span>
                        <h2 id="update-contact-information-title">Contact information</h2>
                        <p>Keep the patient&apos;s residential or contact address current.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label htmlFor="update-address">Address</label>
                            <textarea
                                id="update-address"
                                name="address"
                                autoComplete="street-address"
                                value={formData.address}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.address)}
                                aria-describedby={fieldErrors.address ? "update-address-error" : undefined}
                                rows="4"
                            />
                            {fieldErrors.address && (
                                <p className={styles.fieldError} id="update-address-error">
                                    {fieldErrors.address}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="update-account-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 04</span>
                        <h2 id="update-account-information-title">Account information</h2>
                        <p>Optionally replace the patient&apos;s current access credential.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <label htmlFor="update-password">New password</label>
                            <div className={styles.passwordControl}>
                                <input
                                    className={styles.passwordInput}
                                    id="update-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Leave blank to keep current password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby={
                                        fieldErrors.password
                                            ? "update-password-error"
                                            : "update-password-hint"
                                    }
                                />

                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                        <circle cx="12" cy="12" r="2.75" />
                                    </svg>
                                    <span>{showPassword ? "Hide" : "Show"}</span>
                                </button>
                            </div>
                            {fieldErrors.password ? (
                                <p className={styles.fieldError} id="update-password-error">
                                    {fieldErrors.password}
                                </p>
                            ) : (
                                <p className={styles.fieldHint} id="update-password-hint">
                                    Leave this field blank to keep the existing password.
                                </p>
                            )}
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
                        <span>{isSubmitting ? "Updating patient…" : "Update patient"}</span>
                    </button>
                </footer>
            </form>
        </article>
    );
}


export default UpdatePatient;
