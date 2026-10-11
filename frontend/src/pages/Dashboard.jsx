import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { getAccessToken, logout } from "../utils/auth";
import styles from "./Dashboard.module.css";


const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;


function hasValue(value) {
    if (value === null || value === undefined) {
        return false;
    }

    return typeof value !== "string" || value.trim().length > 0;
}


function formatDetail(value, fallback = "Not provided") {
    return hasValue(value) ? String(value).trim() : fallback;
}


function formatGender(value) {
    if (!hasValue(value)) {
        return "Not provided";
    }

    const normalizedValue = String(value).trim().toLowerCase();

    return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
}


function formatDateOnly(value) {
    if (!hasValue(value)) {
        return "Not recorded";
    }

    const match = DATE_ONLY_PATTERN.exec(String(value));

    if (!match) {
        return String(value);
    }

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
        date.getFullYear() !== Number(year)
        || date.getMonth() !== Number(month) - 1
        || date.getDate() !== Number(day)
    ) {
        return String(value);
    }

    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}


function ArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 7l5 5-5 5" />
        </svg>
    );
}


function AddPatientIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="8.5" cy="7.5" r="3" />
            <path d="M3.5 18.5c.35-3.2 2-4.8 5-4.8 1.2 0 2.2.26 3 .8M17.5 12.5v7M14 16h7" />
        </svg>
    );
}


function LoadingState() {
    return (
        <section
            className={styles.loadingState}
            aria-live="polite"
            aria-busy="true"
        >
            <div className={styles.loadingCopy}>
                <span className={styles.eyebrow}>Patient overview</span>
                <h2>Loading your profile</h2>
                <p>Your latest patient details are being prepared.</p>
            </div>

            <div className={styles.loadingGrid} aria-hidden="true">
                <div className={styles.loadingDetails}>
                    <span className={styles.skeletonLineWide} />
                    <span className={styles.skeletonLine} />
                    <span className={styles.skeletonLine} />
                    <span className={styles.skeletonLineWide} />
                </div>
                <div className={styles.loadingVisit} />
            </div>
        </section>
    );
}


function QuickActions({ navigate }) {
    return (
        <section className={styles.actions} aria-labelledby="dashboard-actions-title">
            <div className={styles.actionsCopy}>
                <span className={styles.sectionKicker}>Patient management</span>
                <h2 id="dashboard-actions-title">Continue your work</h2>
                <p>Review the patient directory or register a new patient record.</p>
            </div>

            <div className={styles.actionLinks}>
                <button
                    type="button"
                    className={styles.secondaryAction}
                    onClick={() => navigate("/patients")}
                >
                    <span>View patient list</span>
                    <ArrowIcon />
                </button>

                <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => navigate("/add-patient")}
                >
                    <AddPatientIcon />
                    <span>Add new patient</span>
                </button>
            </div>
        </section>
    );
}


function Dashboard() {
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            const accessToken = getAccessToken();

            if (!accessToken) {
                logout();
                navigate("/", { replace: true });
                return;
            }

            try {
                const response = await api.get("profile/");

                if (isMounted) {
                    setPatient(response.data);
                }
            } catch (error) {
                console.error(
                    "Could not load profile:",
                    error.response?.data ?? error,
                );

                if (!isMounted) {
                    return;
                }

                if (error.response?.status === 401) {
                    logout();
                    navigate("/", { replace: true });
                } else {
                    setErrorMessage(
                        "Could not load your profile. Please try again.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    if (isLoading) {
        return <LoadingState />;
    }

    const patientName = formatDetail(patient?.name);
    const welcomeName = hasValue(patient?.name)
        ? String(patient.name).trim().split(/\s+/)[0]
        : "";
    const totalVisits = hasValue(patient?.total_visits)
        ? patient.total_visits
        : "Not recorded";

    const patientDetails = [
        { label: "Patient name", value: patientName, wide: true },
        { label: "Mobile number", value: formatDetail(patient?.mobile) },
        { label: "Age", value: formatDetail(patient?.age) },
        { label: "Gender", value: formatGender(patient?.gender) },
        { label: "Blood group", value: formatDetail(patient?.blood_group) },
        { label: "Address", value: formatDetail(patient?.address), wide: true },
    ];

    return (
        <article className={styles.dashboard}>
            <header className={styles.introduction}>
                <div className={styles.introductionCopy}>
                    <span className={styles.eyebrow}>Your care record</span>
                    <h2>
                        Welcome back{welcomeName ? `, ${welcomeName}` : ""}.
                    </h2>
                    <p>
                        A clear view of your personal details and recorded visit
              history, kept together in one organized workspace.
                    </p>
                </div>

                <div className={styles.medicalMark} aria-hidden="true">
                    <span />
                    <span />
                </div>
            </header>

            {errorMessage && (
                <section className={styles.errorState} role="alert">
                    <span className={styles.errorMark} aria-hidden="true">!</span>
                    <div>
                        <h2>Profile unavailable</h2>
                        <p>{errorMessage}</p>
                    </div>
                </section>
            )}

            {!errorMessage && !patient && (
                <section className={styles.emptyState}>
                    <span className={styles.sectionKicker}>Patient profile</span>
                    <h2>No profile information is available</h2>
                    <p>Your patient details could not be displayed at this time.</p>
                </section>
            )}

            {patient && (
                <div className={styles.dashboardGrid}>
                    <section
                        className={styles.profileSection}
                        aria-labelledby="patient-profile-title"
                    >
                        <header className={styles.sectionHeader}>
                            <div>
                                <span className={styles.sectionKicker}>Identity</span>
                                <h2 id="patient-profile-title">Patient profile</h2>
                            </div>
                            <p>Information connected to your patient record.</p>
                        </header>

                        <dl className={styles.detailsGrid}>
                            {patientDetails.map((detail) => (
                                <div
                                    key={detail.label}
                                    className={
                                        detail.wide
                                            ? styles.detailWide
                                            : styles.detail
                                    }
                                >
                                    <dt>{detail.label}</dt>
                                    <dd>{detail.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <aside
                        className={styles.visitSummary}
                        aria-labelledby="visit-summary-title"
                    >
                        <div className={styles.visitHeading}>
                            <span className={styles.visitIcon} aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 6v12M6 12h12" />
                                </svg>
                            </span>
                            <div>
                                <span>Care history</span>
                                <h2 id="visit-summary-title">Recorded visits</h2>
                            </div>
                        </div>

                        <div className={styles.visitCount}>
                            <strong>{totalVisits}</strong>
                            {hasValue(patient.total_visits) && (
                                <span>
                                    {Number(patient.total_visits) === 1
                                        ? "visit"
                                        : "visits"}
                                </span>
                            )}
                        </div>

                        <div className={styles.lastVisit}>
                            <span>Last visit</span>
                            <time dateTime={patient.last_visit_date || undefined}>
                                {formatDateOnly(patient.last_visit_date)}
                            </time>
                        </div>
                    </aside>
                </div>
            )}

            <QuickActions navigate={navigate} />
        </article>
    );
}


export default Dashboard;
