import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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


function ViewPatientIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
        </svg>
    );
}


function UpdatePatientIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M3.5 19a5.5 5.5 0 0 1 9.5-3.8" />
            <path d="m14.5 17.5 4.8-4.8 2 2-4.8 4.8-2.7.7.7-2.7Z" />
        </svg>
    );
}


function AddVisitIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18M12 14v4M10 16h4" />
        </svg>
    );
}


function ViewVisitsIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 5h6M9 3h6v4H9z" />
            <path d="M8 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-2" />
            <path d="M8 12h8M8 16h8" />
        </svg>
    );
}


function DeletePatientIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6" />
            <path d="M10 11v5M14 11v5" />
        </svg>
    );
}


function PatientActions({
    patient,
    navigate,
    variant,
    isExpanded = false,
    onExpand,
    onCollapse,
    onToggle,
    onRequestDelete,
}) {
    const patientName = getPatientName(patient);
    const actionsId = `patient-actions-${variant}-${patient.id}`;
    const triggerRef = useRef(null);
    const firstActionRef = useRef(null);
    const focusActionsAfterExpand = useRef(false);
    const focusTriggerAfterCollapse = useRef(false);

    useEffect(() => {
        if (isExpanded && focusActionsAfterExpand.current) {
            firstActionRef.current?.focus();
            focusActionsAfterExpand.current = false;
        }

        if (!isExpanded && focusTriggerAfterCollapse.current) {
            triggerRef.current?.focus();
            focusTriggerAfterCollapse.current = false;
        }
    }, [isExpanded]);

    const actions = [
        {
            name: "View patient",
            icon: <ViewPatientIcon />,
            onSelect: () => navigate(
                "/view-patient",
                { state: { patientId: patient.id } },
            ),
        },
        {
            name: "Update patient",
            icon: <UpdatePatientIcon />,
            onSelect: () => navigate(
                "/update-patient",
                { state: { patient: patient } },
            ),
        },
        {
            name: "Add visit",
            icon: <AddVisitIcon />,
            onSelect: () => navigate(
                "/add-visit",
                { state: { patient: patient } },
            ),
        },
        {
            name: "View visits",
            icon: <ViewVisitsIcon />,
            onSelect: () => navigate(
                "/visits",
                { state: { patient: patient } },
            ),
        },
        {
            name: "Delete patient",
            icon: <DeletePatientIcon />,
            isDanger: true,
            onSelect: () => onRequestDelete(patient),
        },
    ];

    const handleTriggerClick = (event) => {
        const hasPreciseHover = window.matchMedia?.(
            "(hover: hover) and (pointer: fine)",
        ).matches;

        if (hasPreciseHover && event.detail > 0) {
            onExpand();
            return;
        }

        focusActionsAfterExpand.current = !isExpanded;
        onToggle();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape" && isExpanded) {
            event.preventDefault();
            focusTriggerAfterCollapse.current = true;
            onCollapse();
        }
    };

    return (
        <div
            className={styles.actionControl}
            data-expanded={isExpanded}
            data-patient-action-control
            role="group"
            aria-label={`Actions for ${patientName}`}
            onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                    onExpand();
                }
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === "mouse") {
                    onCollapse();
                }
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    onCollapse();
                }
            }}
            onKeyDown={handleKeyDown}
        >
            <button
                ref={triggerRef}
                type="button"
                className={styles.manageTrigger}
                aria-expanded={isExpanded}
                aria-controls={actionsId}
                data-manage-trigger
                tabIndex={isExpanded ? -1 : 0}
                onClick={handleTriggerClick}
            >
                <span>Manage patient</span>
                <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="m7.5 5 5 5-5 5" />
                </svg>
            </button>

            <div
                id={actionsId}
                className={styles.actionRail}
                aria-hidden={!isExpanded}
            >
                {actions.map((action, index) => (
                    <button
                        ref={index === 0 ? firstActionRef : undefined}
                        type="button"
                        className={
                            action.isDanger
                                ? `${styles.patientActionButton} ${styles.deletePatientAction}`
                                : styles.patientActionButton
                        }
                        aria-label={action.name}
                        tabIndex={isExpanded ? 0 : -1}
                        style={{ "--action-index": index }}
                        onClick={action.onSelect}
                        key={action.name}
                    >
                        <span className={styles.actionIcon} aria-hidden="true">
                            {action.icon}
                        </span>
                        <span className={styles.actionTooltip} aria-hidden="true">
                            {action.name}
                        </span>
                    </button>
                ))}
            </div>
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
    const [expandedActionId, setExpandedActionId] = useState(null);
    const [patientPendingDeletion, setPatientPendingDeletion] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteFeedback, setDeleteFeedback] = useState("");

    const cancelDeleteButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);
    const directoryTitleRef = useRef(null);
    const isDeletingRef = useRef(false);

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

    useEffect(() => {
        isDeletingRef.current = isDeleting;
    }, [isDeleting]);

    useEffect(() => {
        if (!patientPendingDeletion) {
            return undefined;
        }

        const previouslyFocusedElement = document.activeElement;
        const relatedActionControl = previouslyFocusedElement instanceof HTMLElement
            ? previouslyFocusedElement.closest("[data-patient-action-control]")
            : null;
        const focusReturnElement = relatedActionControl?.querySelector(
            "[data-manage-trigger]",
        ) || previouslyFocusedElement;
        const fallbackFocusElement = directoryTitleRef.current;
        const previousBodyOverflow = document.body.style.overflow;

        const handleDialogKeyDown = (event) => {
            if (event.key === "Escape" && !isDeletingRef.current) {
                event.preventDefault();
                setPatientPendingDeletion(null);
                setDeleteError("");
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const dialogButtons = [
                cancelDeleteButtonRef.current,
                deleteButtonRef.current,
            ].filter((button) => button && !button.disabled);

            if (dialogButtons.length === 0) {
                event.preventDefault();
                return;
            }

            const firstButton = dialogButtons[0];
            const lastButton = dialogButtons[dialogButtons.length - 1];

            if (event.shiftKey && document.activeElement === firstButton) {
                event.preventDefault();
                lastButton.focus();
            } else if (!event.shiftKey && document.activeElement === lastButton) {
                event.preventDefault();
                firstButton.focus();
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleDialogKeyDown);
        cancelDeleteButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.removeEventListener("keydown", handleDialogKeyDown);

            if (
                focusReturnElement instanceof HTMLElement
                && focusReturnElement.isConnected
            ) {
                focusReturnElement.focus();
            } else {
                fallbackFocusElement?.focus();
            }
        };
    }, [patientPendingDeletion]);

    const requestPatientDeletion = (patient) => {
        setDeleteError("");
        setDeleteFeedback("");
        setPatientPendingDeletion(patient);
    };

    const closeDeleteDialog = () => {
        if (isDeletingRef.current) {
            return;
        }

        setPatientPendingDeletion(null);
        setDeleteError("");
    };

    const deletePatient = async () => {
        if (!patientPendingDeletion || isDeletingRef.current) {
            return;
        }

        const patientName = getPatientName(patientPendingDeletion);

        setIsDeleting(true);
        setDeleteError("");

        try {
            await api.delete(`/patients/${patientPendingDeletion.id}/`);
            setExpandedActionId(null);
            setPatientPendingDeletion(null);
            setDeleteFeedback(`${patientName} was deleted successfully.`);
            await loadPatients();
        } catch (error) {
            console.log(error);

            const responseDetail = error.response?.data?.detail;
            setDeleteError(
                typeof responseDetail === "string"
                    ? responseDetail
                    : "The patient could not be deleted. Please try again.",
            );
        } finally {
            setIsDeleting(false);
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
                    <h2
                        ref={directoryTitleRef}
                        id="patient-directory-title"
                        tabIndex={-1}
                    >
                        Patient records
                    </h2>
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

            <div
                className={styles.deletionFeedback}
                aria-live="polite"
                aria-atomic="true"
            >
                {deleteFeedback && (
                    <p role="status">
                        <span aria-hidden="true">
                            <svg viewBox="0 0 20 20" focusable="false">
                                <path d="m5 10 3 3 7-7" />
                            </svg>
                        </span>
                        {deleteFeedback}
                    </p>
                )}
            </div>

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
                                                variant="table"
                                                isExpanded={
                                                    expandedActionId === `table-${patient.id}`
                                                }
                                                onExpand={() => {
                                                    setExpandedActionId(`table-${patient.id}`);
                                                }}
                                                onCollapse={() => {
                                                    setExpandedActionId((currentId) => (
                                                        currentId === `table-${patient.id}`
                                                            ? null
                                                            : currentId
                                                    ));
                                                }}
                                                onToggle={() => {
                                                    setExpandedActionId((currentId) => (
                                                        currentId === `table-${patient.id}`
                                                            ? null
                                                            : `table-${patient.id}`
                                                    ));
                                                }}
                                                onRequestDelete={requestPatientDeletion}
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
                                    variant="card"
                                    isExpanded={
                                        expandedActionId === `card-${patient.id}`
                                    }
                                    onExpand={() => {
                                        setExpandedActionId(`card-${patient.id}`);
                                    }}
                                    onCollapse={() => {
                                        setExpandedActionId((currentId) => (
                                            currentId === `card-${patient.id}`
                                                ? null
                                                : currentId
                                        ));
                                    }}
                                    onToggle={() => {
                                        setExpandedActionId((currentId) => (
                                            currentId === `card-${patient.id}`
                                                ? null
                                                : `card-${patient.id}`
                                        ));
                                    }}
                                    onRequestDelete={requestPatientDeletion}
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

            {patientPendingDeletion && (
                <div
                    className={styles.modalBackdrop}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeDeleteDialog();
                        }
                    }}
                >
                    <div
                        className={styles.deleteDialog}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-patient-title"
                        aria-describedby="delete-patient-description"
                        aria-busy={isDeleting}
                    >
                        <span className={styles.dialogIcon} aria-hidden="true">
                            <DeletePatientIcon />
                        </span>

                        <div className={styles.dialogCopy}>
                            <span className={styles.sectionKicker}>Confirm deletion</span>
                            <h2 id="delete-patient-title">Delete patient?</h2>
                            <p id="delete-patient-description">
                                Are you sure you want to delete this patient?
                                <br />
                                This action cannot be undone.
                            </p>
                        </div>

                        <div
                            className={styles.dialogFeedback}
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            {deleteError && <p role="alert">{deleteError}</p>}
                        </div>

                        <div className={styles.dialogActions}>
                            <button
                                ref={cancelDeleteButtonRef}
                                type="button"
                                className={styles.cancelDeleteButton}
                                disabled={isDeleting}
                                onClick={closeDeleteDialog}
                            >
                                Cancel
                            </button>
                            <button
                                ref={deleteButtonRef}
                                type="button"
                                className={styles.confirmDeleteButton}
                                disabled={isDeleting}
                                onClick={deletePatient}
                            >
                                {isDeleting && (
                                    <span className={styles.deleteSpinner} aria-hidden="true" />
                                )}
                                <span>{isDeleting ? "Deleting patient…" : "Delete patient"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}


export default Patients;
