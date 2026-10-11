import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import styles from "./Patients.module.css";


const SKELETON_ITEMS = Array.from({ length: 5 }, (_, index) => index);


function getPatientName(patient) {
    const fullName = [patient.first_name, patient.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Unnamed patient";
}


function getInitials(patient) {
    const initials = [patient.first_name, patient.last_name]
        .filter(Boolean)
        .map((name) => name.trim().charAt(0))
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


function PatientActions({
    patient,
    navigate,
    deletePatient,
    compact = false,
    isExpanded = false,
    onToggle,
}) {
    const patientName = getPatientName(patient);
    const secondaryActionsId = `patient-secondary-actions-${patient.id}`;

    const secondaryActions = (
        <>
            <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => {
                    navigate(
                        "/update-patient",
                        {
                            state: {
                                patient: patient,
                            },
                        },
                    );
                }}
            >
                Update
            </button>

            <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => {
                    navigate(
                        "/visits",
                        {
                            state: {
                                patient: patient,
                            },
                        },
                    );
                }}
            >
                View visits
            </button>

            <button
                type="button"
                className={styles.deleteAction}
                onClick={() => deletePatient(patient.id)}
            >
                Delete
            </button>
        </>
    );

    return (
        <div
            className={styles.actionGroup}
            role="group"
            aria-label={`Actions for ${patientName}`}
        >
            <button
                type="button"
                className={styles.viewAction}
                onClick={() => {
                    navigate(
                        "/view-patient",
                        {
                            state: {
                                patientId: patient.id,
                            },
                        },
                    );
                }}
            >
                View patient
            </button>

            <button
                type="button"
                className={styles.visitAction}
                onClick={() => {
                    navigate(
                        "/add-visit",
                        {
                            state: {
                                patient: patient,
                            },
                        },
                    );
                }}
            >
                Add visit
            </button>

            {compact ? (
                <>
                    <button
                        type="button"
                        className={styles.mobileActionsToggle}
                        aria-expanded={isExpanded}
                        aria-controls={secondaryActionsId}
                        onClick={onToggle}
                    >
                        <span>{isExpanded ? "Less actions" : "More actions"}</span>
                        <span className={styles.toggleChevron} aria-hidden="true">⌄</span>
                    </button>

                    <div
                        id={secondaryActionsId}
                        className={styles.secondaryActions}
                        hidden={!isExpanded}
                    >
                        {secondaryActions}
                    </div>
                </>
            ) : (
                secondaryActions
            )}
        </div>
    );
}


function LoadingDirectory() {
    return (
        <section
            className={styles.loadingState}
            role="status"
            aria-live="polite"
            aria-label="Loading patient directory"
        >
            <span className={styles.visuallyHidden}>Loading patient directory.</span>

            <div className={styles.tableSkeleton} aria-hidden="true">
                <div className={styles.skeletonHeader} />
                {SKELETON_ITEMS.map((item) => (
                    <div className={styles.skeletonRow} key={item}>
                        <span className={styles.skeletonAvatar} />
                        <span className={styles.skeletonName} />
                        <span className={styles.skeletonDetail} />
                        <span className={styles.skeletonDetail} />
                        <span className={styles.skeletonDetail} />
                        <span className={styles.skeletonActions} />
                    </div>
                ))}
            </div>

            <div className={styles.cardSkeletons} aria-hidden="true">
                {SKELETON_ITEMS.slice(0, 3).map((item) => (
                    <article className={styles.skeletonCard} key={item}>
                        <div className={styles.skeletonCardIdentity}>
                            <span className={styles.skeletonAvatar} />
                            <span className={styles.skeletonName} />
                        </div>
                        <span className={styles.skeletonCardDetails} />
                        <span className={styles.skeletonCardActions} />
                    </article>
                ))}
            </div>
        </section>
    );
}


function Patients() {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    const [patients, setPatients] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [patientCount, setPatientCount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [expandedPatientId, setExpandedPatientId] = useState(null);

    const applyPatientResponse = (response) => {
        setPatients(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
        setPatientCount(
            typeof response.data.count === "number" ? response.data.count : null,
        );
    };

    const loadPatients = async (url = "/patients/") => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await api.get(url);
            applyPatientResponse(response);
        } catch (error) {
            console.log(error);
            setErrorMessage("The patient directory could not be loaded. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadInitialPatients = async () => {
            try {
                const response = await api.get("/patients/");

                if (isMounted) {
                    applyPatientResponse(response);
                }
            } catch (error) {
                console.log(error);

                if (isMounted) {
                    setErrorMessage(
                        "The patient directory could not be loaded. Please try again.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialPatients();

        return () => {
            isMounted = false;
        };
    }, []);

    const deletePatient = async (id) => {
        try {
            await api.delete(`/patients/${id}/`);
            alert("Patient deleted");
            loadPatients();
        } catch (error) {
            console.log(error);
        }
    };

    const entranceMotion = (index) => (
        shouldReduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: {
                    duration: 0.24,
                    delay: Math.min(index * 0.035, 0.14),
                },
            }
    );

    return (
        <section className={styles.directory} aria-labelledby="patient-directory-title">
            <header className={styles.introduction}>
                <div>
                    <span className={styles.eyebrow}>Patient directory</span>
                    <h2 id="patient-directory-title">Patient records</h2>
                    <p>
                        Review essential patient details and continue care from one
                        clear, organized directory.
                    </p>
                </div>

                {!isLoading && !errorMessage && patientCount !== null && (
                    <div
                        className={styles.count}
                        aria-label={`${patientCount} ${patientCount === 1 ? "patient" : "patients"} total`}
                    >
                        <strong>{patientCount}</strong>
                        <span>{patientCount === 1 ? "patient" : "patients"}</span>
                    </div>
                )}
            </header>

            {isLoading && <LoadingDirectory />}

            {!isLoading && errorMessage && (
                <section className={styles.errorState} role="alert">
                    <span className={styles.errorMark} aria-hidden="true">!</span>
                    <div>
                        <h2>Patient records unavailable</h2>
                        <p>{errorMessage}</p>
                        <button type="button" onClick={() => loadPatients()}>
                            Try again
                        </button>
                    </div>
                </section>
            )}

            {!isLoading && !errorMessage && patients.length === 0 && (
                <section className={styles.emptyState}>
                    <span className={styles.emptyMark} aria-hidden="true">+</span>
                    <div>
                        <span className={styles.sectionKicker}>No patient records</span>
                        <h2>Your patient directory is ready to begin</h2>
                        <p>
                            Add the first patient to start recording their profile and
                            visit history.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/add-patient")}
                        >
                            Add patient
                        </button>
                    </div>
                </section>
            )}

            {!isLoading && !errorMessage && patients.length > 0 && (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.patientTable}>
                            <caption className={styles.visuallyHidden}>
                                Patient directory with contact and care actions
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Patient</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Blood group</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient, index) => (
                                    <motion.tr
                                        key={patient.id}
                                        {...entranceMotion(index)}
                                    >
                                        <td>
                                            <div className={styles.patientIdentity}>
                                                <span className={styles.avatar} aria-hidden="true">
                                                    {getInitials(patient)}
                                                </span>
                                                <span className={styles.identityCopy}>
                                                    <strong>{getPatientName(patient)}</strong>
                                                    <small>Patient ID #{patient.id}</small>
                                                </span>
                                            </div>
                                        </td>
                                        <td>{formatValue(patient.mobile)}</td>
                                        <td>{formatValue(patient.age)}</td>
                                        <td>{formatGender(patient.gender)}</td>
                                        <td>
                                            <span className={styles.bloodGroup}>
                                                {formatValue(patient.blood_group)}
                                            </span>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <PatientActions
                                                patient={patient}
                                                navigate={navigate}
                                                deletePatient={deletePatient}
                                            />
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.patientCards}>
                        {patients.map((patient, index) => (
                            <motion.article
                                className={styles.patientCard}
                                key={patient.id}
                                {...entranceMotion(index)}
                            >
                                <header className={styles.cardHeader}>
                                    <span className={styles.avatar} aria-hidden="true">
                                        {getInitials(patient)}
                                    </span>
                                    <div className={styles.identityCopy}>
                                        <h2>{getPatientName(patient)}</h2>
                                        <span>Patient ID #{patient.id}</span>
                                    </div>
                                </header>

                                <dl className={styles.cardDetails}>
                                    <div className={styles.mobileDetail}>
                                        <dt>Mobile</dt>
                                        <dd>{formatValue(patient.mobile)}</dd>
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
                                        <dd>{formatValue(patient.blood_group)}</dd>
                                    </div>
                                </dl>

                                <PatientActions
                                    patient={patient}
                                    navigate={navigate}
                                    deletePatient={deletePatient}
                                    compact
                                    isExpanded={expandedPatientId === patient.id}
                                    onToggle={() => {
                                        setExpandedPatientId((currentId) => (
                                            currentId === patient.id ? null : patient.id
                                        ));
                                    }}
                                />
                            </motion.article>
                        ))}
                    </div>

                    <nav className={styles.pagination} aria-label="Patient directory pages">
                        <p>
                            Showing <strong>{patients.length}</strong>
                            {patientCount !== null && (
                                <> of <strong>{patientCount}</strong></>
                            )} patient {patients.length === 1 ? "record" : "records"}
                        </p>

                        <div>
                            <button
                                type="button"
                                disabled={!previousPage}
                                onClick={() => loadPatients(previousPage)}
                            >
                                <span aria-hidden="true">←</span>
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={!nextPage}
                                onClick={() => loadPatients(nextPage)}
                            >
                                Next
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </nav>
                </>
            )}
        </section>
    );
}


export default Patients;
