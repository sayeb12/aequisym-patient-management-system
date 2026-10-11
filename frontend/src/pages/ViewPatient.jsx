import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";
import styles from "./ViewPatient.module.css";


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


function formatGender(value) {
    const gender = formatValue(value);

    if (gender === "Not provided") {
        return gender;
    }

    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}


function formatVisitDate(value) {
    if (!value) {
        return "No visits recorded";
    }

    const parsedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return formatValue(value);
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(parsedDate);
}


function LoadingProfile() {
    return (
        <section
            className={styles.loadingState}
            role="status"
            aria-live="polite"
            aria-label="Loading patient profile"
        >
            <span className={styles.visuallyHidden}>Loading patient profile.</span>

            <div className={styles.loadingHeader} aria-hidden="true">
                <span className={styles.skeletonAvatar} />
                <div className={styles.loadingIdentity}>
                    <span className={styles.skeletonEyebrow} />
                    <span className={styles.skeletonTitle} />
                    <span className={styles.skeletonCopy} />
                </div>
            </div>

            <div className={styles.loadingGrid} aria-hidden="true">
                <div className={styles.loadingDetails}>
                    <span className={styles.skeletonSectionTitle} />
                    <div className={styles.skeletonRows}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <span className={styles.skeletonRow} key={index} />
                        ))}
                    </div>
                </div>
                <span className={styles.skeletonVisit} />
            </div>
        </section>
    );
}


function ViewPatient() {
    const location = useLocation();
    const navigate = useNavigate();
    const patientId = location.state?.patientId;

    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const loadPatient = async () => {
            if (!patientId) {
                setPatient(null);
                setErrorMessage(
                    "No patient was selected. Return to the patient directory and choose a record to view.",
                );
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await api.get(`/patients/${patientId}/`);

                if (isMounted) {
                    setPatient(response.data);
                }
            } catch (error) {
                console.log(error);

                if (isMounted) {
                    setPatient(null);
                    setErrorMessage(
                        "This patient profile could not be loaded. Please try again or return to the patient directory.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadPatient();

        return () => {
            isMounted = false;
        };
    }, [patientId, retryCount]);

    if (isLoading) {
        return <LoadingProfile />;
    }

    if (errorMessage || !patient) {
        return (
            <section className={styles.profilePage} aria-labelledby="profile-error-title">
                <header className={styles.simpleHeader}>
                    <span className={styles.eyebrow}>Patient profile</span>
                    <h1 id="profile-error-title">Patient record unavailable</h1>
                    <p>{errorMessage || "The requested patient record is unavailable."}</p>
                </header>

                <div className={styles.errorState} role="alert">
                    <span className={styles.errorMark} aria-hidden="true">!</span>
                    <div>
                        <h2>We could not open this profile</h2>
                        <p>
                            Check the selected record or return to the directory to
                            continue managing patient care.
                        </p>
                        <div className={styles.errorActions}>
                            {patientId && (
                                <button
                                    type="button"
                                    className={styles.primaryAction}
                                    onClick={() => setRetryCount((count) => count + 1)}
                                >
                                    Try again
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.secondaryAction}
                                onClick={() => navigate("/patients")}
                            >
                                Back to patients
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const patientName = getPatientName(patient);
    const hasVisitCount = patient.total_visits !== null
        && patient.total_visits !== undefined
        && String(patient.total_visits).trim() !== ""
        && Number.isFinite(Number(patient.total_visits));
    const visitCount = hasVisitCount ? Number(patient.total_visits) : null;

    return (
        <article className={styles.profilePage} aria-labelledby="patient-profile-title">
            <header className={styles.profileHeader}>
                <div className={styles.identityBlock}>
                    <span className={styles.avatar} aria-hidden="true">
                        {getInitials(patient)}
                    </span>

                    <div className={styles.identityCopy}>
                        <span className={styles.eyebrow}>Patient profile</span>
                        <h1 id="patient-profile-title">{patientName}</h1>
                        <p>
                            Review this patient&apos;s identity, contact details, and
                            recorded visit activity.
                        </p>
                    </div>
                </div>

                <div className={styles.recordIdentity}>
                    <span>Patient ID</span>
                    <strong>
                        {patient.id === null || patient.id === undefined
                            ? "Not provided"
                            : `#${formatValue(patient.id)}`}
                    </strong>
                </div>
            </header>

            <div className={styles.profileGrid}>
                <div className={styles.informationColumn}>
                    <section className={styles.informationSection} aria-labelledby="identity-heading">
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionNumber}>01</span>
                            <div>
                                <h2 id="identity-heading">Identity information</h2>
                                <p>Core personal and medical record details.</p>
                            </div>
                        </div>

                        <dl className={styles.detailsGrid}>
                            <div>
                                <dt>First name</dt>
                                <dd>{formatValue(patient.first_name)}</dd>
                            </div>
                            <div>
                                <dt>Last name</dt>
                                <dd>{formatValue(patient.last_name)}</dd>
                            </div>
                            <div>
                                <dt>Age</dt>
                                <dd>{formatValue(patient.age)}</dd>
                            </div>
                            <div>
                                <dt>Gender</dt>
                                <dd>{formatGender(patient.gender)}</dd>
                            </div>
                            <div>
                                <dt>Blood group</dt>
                                <dd>
                                    <span className={styles.bloodGroup}>
                                        {formatValue(patient.blood_group)}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className={styles.informationSection} aria-labelledby="contact-heading">
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionNumber}>02</span>
                            <div>
                                <h2 id="contact-heading">Contact information</h2>
                                <p>Contact details stored with this patient record.</p>
                            </div>
                        </div>

                        <dl className={styles.contactDetails}>
                            <div>
                                <dt>Mobile number</dt>
                                <dd>{formatValue(patient.mobile)}</dd>
                            </div>
                            <div>
                                <dt>Address</dt>
                                <dd>{formatValue(patient.address)}</dd>
                            </div>
                        </dl>
                    </section>
                </div>

                <aside className={styles.visitSummary} aria-labelledby="visit-summary-heading">
                    <div className={styles.visitHeading}>
                        <span className={styles.visitIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                <path d="M9 14h6M12 11v6" />
                            </svg>
                        </span>
                        <div>
                            <span>Care activity</span>
                            <h2 id="visit-summary-heading">Visit history</h2>
                        </div>
                    </div>

                    <div className={styles.visitCount}>
                        <strong>{visitCount ?? "—"}</strong>
                        <span>
                            {visitCount === null
                                ? "visit count unavailable"
                                : visitCount === 1
                                    ? "recorded visit"
                                    : "recorded visits"}
                        </span>
                    </div>

                    <div className={styles.lastVisit}>
                        <span>Most recent visit</span>
                        {patient.last_visit_date ? (
                            <time dateTime={patient.last_visit_date}>
                                {formatVisitDate(patient.last_visit_date)}
                            </time>
                        ) : (
                            <strong>No visits recorded</strong>
                        )}
                    </div>
                </aside>
            </div>

            <section className={styles.actions} aria-labelledby="profile-actions-heading">
                <div className={styles.actionsCopy}>
                    <span className={styles.eyebrow}>Patient actions</span>
                    <h2 id="profile-actions-heading">Continue managing this record</h2>
                    <p>Update patient details or continue to their visit workflow.</p>
                </div>

                <div className={styles.actionButtons}>
                    <button
                        type="button"
                        className={styles.primaryAction}
                        onClick={() => navigate("/update-patient", { state: { patient } })}
                    >
                        Update patient
                    </button>
                    <button
                        type="button"
                        className={styles.primaryAction}
                        onClick={() => navigate("/add-visit", { state: { patient } })}
                    >
                        Add visit
                    </button>
                    <button
                        type="button"
                        className={styles.secondaryAction}
                        onClick={() => navigate("/visits", { state: { patient } })}
                    >
                        View visits
                    </button>
                    <button
                        type="button"
                        className={styles.secondaryAction}
                        onClick={() => navigate("/patients")}
                    >
                        Back to patients
                    </button>
                </div>
            </section>
        </article>
    );
}


export default ViewPatient;
