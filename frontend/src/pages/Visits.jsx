import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";
import styles from "./Visits.module.css";


const NOTE_PREVIEW_LENGTH = 240;
const SKELETON_ITEMS = Array.from({ length: 3 }, (_, index) => index);


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


function getDateValue(value) {
    if (!value) {
        return Number.NEGATIVE_INFINITY;
    }

    const dateValue = new Date(`${value}T00:00:00Z`).getTime();
    return Number.isNaN(dateValue) ? Number.NEGATIVE_INFINITY : dateValue;
}


function formatVisitDate(value) {
    const dateValue = getDateValue(value);

    if (!Number.isFinite(dateValue)) {
        return "Date not provided";
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(dateValue));
}


function sortVisits(visits) {
    return [...visits].sort((firstVisit, secondVisit) => {
        const firstDate = getDateValue(firstVisit.visit_date);
        const secondDate = getDateValue(secondVisit.visit_date);

        if (firstDate !== secondDate) {
            return secondDate - firstDate;
        }

        const firstId = Number(firstVisit.id);
        const secondId = Number(secondVisit.id);

        if (Number.isFinite(firstId) && Number.isFinite(secondId)) {
            return secondId - firstId;
        }

        return String(secondVisit.id ?? "").localeCompare(
            String(firstVisit.id ?? ""),
        );
    });
}


async function fetchAllVisitPages(initialUrl) {
    const visits = [];
    const requestedUrls = new Set();
    let nextUrl = initialUrl;

    while (nextUrl) {
        if (requestedUrls.has(nextUrl)) {
            throw new Error("The visit history returned a repeated pagination link.");
        }

        requestedUrls.add(nextUrl);

        const response = await api.get(nextUrl);
        const responseData = response.data;

        if (Array.isArray(responseData)) {
            visits.push(...responseData);
            nextUrl = null;
        } else {
            const pageResults = Array.isArray(responseData?.results)
                ? responseData.results
                : [];

            visits.push(...pageResults);
            nextUrl = responseData?.next || null;
        }
    }

    return sortVisits(visits);
}


function LoadingHistory() {
    return (
        <section
            className={styles.loadingState}
            role="status"
            aria-live="polite"
            aria-label="Loading patient visit history"
        >
            <span className={styles.visuallyHidden}>Loading patient visit history.</span>

            <div className={styles.loadingHeading} aria-hidden="true">
                <span className={styles.skeletonLabel} />
                <span className={styles.skeletonTitle} />
            </div>

            <div className={styles.skeletonTimeline} aria-hidden="true">
                {SKELETON_ITEMS.map((item) => (
                    <div className={styles.skeletonItem} key={item}>
                        <span className={styles.skeletonMarker} />
                        <div className={styles.skeletonCard}>
                            <span className={styles.skeletonDate} />
                            <span className={styles.skeletonDoctor} />
                            <span className={styles.skeletonNote} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


function Visits() {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient;
    const patientId = patient?.id;

    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [retryCount, setRetryCount] = useState(0);
    const [expandedVisitIds, setExpandedVisitIds] = useState(() => new Set());

    useEffect(() => {
        if (!patientId) {
            return undefined;
        }

        let isMounted = true;

        const loadVisits = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const allVisits = await fetchAllVisitPages(
                    `/patients/${patientId}/visits/`,
                );

                if (isMounted) {
                    setVisits(allVisits);
                }
            } catch (error) {
                console.log(error);

                if (isMounted) {
                    setVisits([]);
                    setErrorMessage(
                        "The visit history could not be loaded. Please try again.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadVisits();

        return () => {
            isMounted = false;
        };
    }, [patientId, retryCount]);

    const toggleNote = (visitId) => {
        setExpandedVisitIds((currentIds) => {
            const nextIds = new Set(currentIds);

            if (nextIds.has(visitId)) {
                nextIds.delete(visitId);
            } else {
                nextIds.add(visitId);
            }

            return nextIds;
        });
    };

    if (!patient || !patientId) {
        return (
            <section className={styles.missingState} aria-labelledby="missing-visits-patient-title">
                <span className={styles.eyebrow}>Visit history</span>
                <h1 id="missing-visits-patient-title">Select a patient first</h1>
                <p>
                    Return to the patient directory and choose a patient to review
                    their recorded consultations.
                </p>
                <button type="button" onClick={() => navigate("/patients")}>Back to patients</button>
            </section>
        );
    }

    return (
        <article className={styles.historyPage} aria-labelledby="visit-history-title">
            <header className={styles.introduction}>
                <div>
                    <span className={styles.eyebrow}>Visit history</span>
                    <h1 id="visit-history-title">Patient visits</h1>
                    <p>
                        Review documented consultations and clinical notes for this
                        patient in one chronological record.
                    </p>
                </div>

                <div className={styles.headerActions}>
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
                        onClick={() => navigate(
                            "/view-patient",
                            { state: { patientId: patient.id } },
                        )}
                    >
                        Back to patient
                    </button>
                </div>
            </header>

            <section className={styles.patientContext} aria-labelledby="history-patient-name">
                <div className={styles.patientIdentity}>
                    <span className={styles.avatar} aria-hidden="true">
                        {getInitials(patient)}
                    </span>
                    <div>
                        <span className={styles.contextLabel}>Patient</span>
                        <h2 id="history-patient-name">{getPatientName(patient)}</h2>
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

            {isLoading && <LoadingHistory />}

            {!isLoading && errorMessage && (
                <section className={styles.errorState} role="alert">
                    <span className={styles.errorMark} aria-hidden="true">!</span>
                    <div>
                        <h2>Visit history unavailable</h2>
                        <p>{errorMessage}</p>
                        <button
                            type="button"
                            onClick={() => setRetryCount((count) => count + 1)}
                        >
                            Try again
                        </button>
                    </div>
                </section>
            )}

            {!isLoading && !errorMessage && visits.length === 0 && (
                <section className={styles.emptyState}>
                    <span className={styles.emptyMark} aria-hidden="true">+</span>
                    <div>
                        <span className={styles.sectionKicker}>No recorded visits</span>
                        <h2>Begin this patient&apos;s visit history</h2>
                        <p>
                            Add the first consultation to begin documenting this
                            patient&apos;s clinical history.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/add-visit", { state: { patient } })}
                        >
                            Add visit
                        </button>
                    </div>
                </section>
            )}

            {!isLoading && !errorMessage && visits.length > 0 && (
                <section className={styles.timelineSection} aria-labelledby="recorded-visits-title">
                    <header className={styles.timelineHeader}>
                        <div>
                            <span className={styles.sectionKicker}>Recorded care</span>
                            <h2 id="recorded-visits-title">Consultation timeline</h2>
                        </div>
                        <p>
                            <strong>{visits.length}</strong>
                            {visits.length === 1 ? " visit" : " visits"}
                        </p>
                    </header>

                    <ol className={styles.timeline}>
                        {visits.map((visit, index) => {
                            const visitKey = visit.id ?? `visit-${index}`;
                            const note = formatValue(visit.clinical_note);
                            const isLongNote = note.length > NOTE_PREVIEW_LENGTH;
                            const isExpanded = expandedVisitIds.has(visitKey);
                            const noteId = `visit-note-${visitKey}`;

                            return (
                                <li
                                    className={styles.timelineItem}
                                    key={visitKey}
                                    style={{ "--visit-index": Math.min(index, 6) }}
                                >
                                    <span className={styles.timelineMarker} aria-hidden="true" />

                                    <article className={styles.visitCard}>
                                        <header className={styles.visitCardHeader}>
                                            <div>
                                                <span className={styles.visitLabel}>Visit date</span>
                                                {visit.visit_date ? (
                                                    <time dateTime={visit.visit_date}>
                                                        {formatVisitDate(visit.visit_date)}
                                                    </time>
                                                ) : (
                                                    <strong>Date not provided</strong>
                                                )}
                                            </div>

                                            <div className={styles.doctorDetails}>
                                                <span>Doctor</span>
                                                <strong>{formatValue(visit.doctor_name)}</strong>
                                            </div>
                                        </header>

                                        <div className={styles.noteSection}>
                                            <span>Clinical note</span>
                                            <p
                                                id={noteId}
                                                className={
                                                    isLongNote && !isExpanded
                                                        ? styles.notePreview
                                                        : styles.note
                                                }
                                            >
                                                {note}
                                            </p>

                                            {isLongNote && (
                                                <button
                                                    type="button"
                                                    className={styles.noteToggle}
                                                    aria-expanded={isExpanded}
                                                    aria-controls={noteId}
                                                    onClick={() => toggleNote(visitKey)}
                                                >
                                                    {isExpanded ? "Show less" : "Show full note"}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            )}
        </article>
    );
}


export default Visits;
