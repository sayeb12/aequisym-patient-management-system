import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";
import styles from "./AddVisit.module.css";


const FIELD_LABELS = {
    patient: "Patient",
    doctor_name: "Doctor name",
    visit_date: "Visit date",
    clinical_note: "Clinical note",
};


function getPatientName(patient) {
    const fullName = [patient?.first_name, patient?.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Unnamed patient";
}


function getInitials(patient) {
    const initials = [patient?.first_name, patient?.last_name]
        .filter(Boolean)
        .map((name) => String(name).trim().charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return initials || "PT";
}


function formatValue(value) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return "Not provided";
    }

    return String(value).trim();
}


function getErrorDetails(error) {
    const responseData = error.response?.data;

    if (!responseData) {
        return {
            fields: {},
            message: "The visit could not be saved. Please try again.",
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
        const label = FIELD_LABELS[field] || "Visit record";

        fields[field] = message;
        messages.push(`${label}: ${message}`);
    });

    return {
        fields,
        message: messages.join(" ") || "The visit could not be saved. Please try again.",
    };
}


function AddVisit() {
    const navigate = useNavigate();
    const location = useLocation();
    const patient = location.state?.patient;

    const [form, setForm] = useState(() => ({
        patient: patient?.id ?? "",
        doctor_name: "",
        visit_date: "",
        clinical_note: "",
    }));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
        setFieldErrors((currentErrors) => {
            if (!currentErrors[name]) {
                return currentErrors;
            }

            const nextErrors = { ...currentErrors };
            delete nextErrors[name];
            return nextErrors;
        });
        setFeedback(null);
    };

    const submitVisit = async (event) => {
        event.preventDefault();

        if (!patient || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);
        setFieldErrors({});

        try {
            await api.post(
                "/patient-visits/",
                form,
            );

            setFeedback({
                type: "success",
                message: "Visit saved successfully. Returning to the patient directory…",
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
            <section className={styles.missingState} aria-labelledby="missing-visit-patient-title">
                <span className={styles.eyebrow}>Visit documentation</span>
                <h1 id="missing-visit-patient-title">Select a patient first</h1>
                <p>
                    Return to the patient directory and choose the patient whose
                    consultation you want to document.
                </p>
                <button type="button" onClick={() => navigate("/patients")}>Back to patients</button>
            </section>
        );
    }

    return (
        <article className={styles.visitPage} aria-labelledby="add-visit-title">
            <header className={styles.introduction}>
                <span className={styles.eyebrow}>Visit documentation</span>
                <h1 id="add-visit-title">Add patient visit</h1>
                <p>Record consultation details and clinical notes for this patient.</p>
            </header>

            <section className={styles.patientContext} aria-labelledby="visit-patient-name">
                <div className={styles.patientIdentity}>
                    <span className={styles.avatar} aria-hidden="true">
                        {getInitials(patient)}
                    </span>
                    <div>
                        <span className={styles.contextLabel}>Patient</span>
                        <h2 id="visit-patient-name">{getPatientName(patient)}</h2>
                    </div>
                </div>

                <dl className={styles.patientDetails}>
                    <div>
                        <dt>Patient ID</dt>
                        <dd>#{formatValue(patient.id)}</dd>
                    </div>
                    {patient.mobile !== null
                        && patient.mobile !== undefined
                        && String(patient.mobile).trim() !== "" && (
                        <div>
                            <dt>Mobile number</dt>
                            <dd>{formatValue(patient.mobile)}</dd>
                        </div>
                    )}
                </dl>
            </section>

            <form
                className={styles.formSurface}
                onSubmit={submitVisit}
                aria-busy={isSubmitting}
            >
                <section
                    className={styles.formSection}
                    aria-labelledby="visit-information-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 01</span>
                        <h2 id="visit-information-title">Visit information</h2>
                        <p>Record the clinician and consultation date.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={styles.field}>
                            <label htmlFor="visit-doctor-name">Doctor name</label>
                            <input
                                id="visit-doctor-name"
                                name="doctor_name"
                                type="text"
                                autoComplete="off"
                                maxLength="100"
                                placeholder="Enter doctor name"
                                value={form.doctor_name}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.doctor_name)}
                                aria-describedby={
                                    fieldErrors.doctor_name
                                        ? "visit-doctor-name-error"
                                        : undefined
                                }
                                required
                            />
                            {fieldErrors.doctor_name && (
                                <p className={styles.fieldError} id="visit-doctor-name-error">
                                    {fieldErrors.doctor_name}
                                </p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="visit-date">Visit date</label>
                            <input
                                id="visit-date"
                                name="visit_date"
                                type="date"
                                value={form.visit_date}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.visit_date)}
                                aria-describedby={
                                    fieldErrors.visit_date
                                        ? "visit-date-error"
                                        : undefined
                                }
                                required
                            />
                            {fieldErrors.visit_date && (
                                <p className={styles.fieldError} id="visit-date-error">
                                    {fieldErrors.visit_date}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    className={styles.formSection}
                    aria-labelledby="clinical-documentation-title"
                >
                    <header className={styles.sectionHeading}>
                        <span>Section 02</span>
                        <h2 id="clinical-documentation-title">Clinical documentation</h2>
                        <p>Capture the relevant consultation notes for this visit.</p>
                    </header>

                    <div className={styles.fieldGrid}>
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label htmlFor="clinical-note">Clinical note</label>
                            <textarea
                                id="clinical-note"
                                name="clinical_note"
                                placeholder="Document consultation details and clinical observations"
                                value={form.clinical_note}
                                onChange={handleChange}
                                aria-invalid={Boolean(fieldErrors.clinical_note)}
                                aria-describedby={
                                    fieldErrors.clinical_note
                                        ? "clinical-note-hint clinical-note-error"
                                        : "clinical-note-hint"
                                }
                                rows="7"
                                required
                            />
                            <p className={styles.fieldHint} id="clinical-note-hint">
                                Include only information relevant to this consultation.
                            </p>
                            {fieldErrors.clinical_note && (
                                <p className={styles.fieldError} id="clinical-note-error">
                                    {fieldErrors.clinical_note}
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
                        <span>{isSubmitting ? "Saving visit…" : "Save visit"}</span>
                    </button>
                </footer>
            </form>
        </article>
    );
}


export default AddVisit;
