import {
    useEffect,
    useRef,
} from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "motion/react";
import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import { logout } from "../../utils/auth";
import styles from "./Sidebar.module.css";


const NAVIGATION_ITEMS = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
    },
    {
        label: "Patients",
        path: "/patients",
        icon: "patients",
    },
    {
        label: "Add patient",
        path: "/add-patient",
        icon: "add-patient",
    },
];


function NavigationIcon({ name }) {
    if (name === "dashboard") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" />
                <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" />
                <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" />
                <rect x="14" y="14" width="6.5" height="6.5" rx="1.5" />
            </svg>
        );
    }

    if (name === "patients") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="9" cy="8" r="3.25" />
                <path d="M3.75 19c.4-3.4 2.2-5.1 5.25-5.1s4.85 1.7 5.25 5.1" />
                <path d="M15.5 5.4a3.15 3.15 0 0 1 0 5.2M16.4 14c2.2.45 3.48 2.1 3.85 5" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="9" cy="8" r="3.25" />
            <path d="M3.75 19c.4-3.4 2.2-5.1 5.25-5.1 1.35 0 2.44.33 3.27.98" />
            <path d="M18 13v7M14.5 16.5h7" />
        </svg>
    );
}


function Brand() {
    return (
        <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
                <svg viewBox="0 0 40 40" focusable="false">
                    <circle cx="20" cy="20" r="15.5" />
                    <path d="M20 11.5v17M11.5 20h17" />
                </svg>
            </span>

            <span className={styles.brandText}>
                <strong>AEQUISYM</strong>
                <small>Patient workspace</small>
            </span>
        </div>
    );
}


function SidebarContent({
    closeButtonRef,
    indicatorId,
    isDrawer = false,
    onClose,
    onLogout,
    prefersReducedMotion,
}) {
    const indicatorTransition = prefersReducedMotion
        ? { duration: 0 }
        : {
            type: "spring",
            stiffness: 430,
            damping: 38,
            mass: 0.72,
        };

    return (
        <>
            <header className={styles.sidebarHeader}>
                <Brand />

                {isDrawer && (
                    <button
                        ref={closeButtonRef}
                        className={styles.closeButton}
                        type="button"
                        aria-label="Close navigation"
                        onClick={onClose}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m6 6 12 12M18 6 6 18" />
                        </svg>
                    </button>
                )}
            </header>

            <nav className={styles.navigation} aria-label="Primary navigation">
                <p className={styles.navigationLabel}>Navigation</p>

                <ul className={styles.navigationList}>
                    {NAVIGATION_ITEMS.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                className={({ isActive }) => (
                                    `${styles.navigationLink} ${
                                        isActive ? styles.navigationLinkActive : ""
                                    }`
                                )}
                                to={item.path}
                                end
                                onClick={isDrawer ? onClose : undefined}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.span
                                                className={styles.activeIndicator}
                                                layoutId={indicatorId}
                                                transition={indicatorTransition}
                                            />
                                        )}

                                        <span className={styles.navigationIcon}>
                                            <NavigationIcon name={item.icon} />
                                        </span>
                                        <span className={styles.navigationText}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <footer className={styles.sidebarFooter}>
                <button
                    className={styles.logoutButton}
                    type="button"
                    onClick={onLogout}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M10 5H5.75A1.75 1.75 0 0 0 4 6.75v10.5C4 18.22 4.78 19 5.75 19H10" />
                        <path d="M14.5 8.5 18 12l-3.5 3.5M8.5 12H18" />
                    </svg>
                    <span>Log out</span>
                </button>
            </footer>
        </>
    );
}


function Sidebar({ isOpen, menuButtonRef, onClose }) {
    const drawerRef = useRef(null);
    const closeButtonRef = useRef(null);
    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement;
        const menuButton = menuButtonRef.current;
        const desktopQuery = window.matchMedia("(min-width: 64rem)");

        document.body.style.overflow = "hidden";

        const focusFrame = window.requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab" || !drawerRef.current) {
                return;
            }

            const focusableElements = drawerRef.current.querySelectorAll(
                "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        const handleDesktopChange = (event) => {
            if (event.matches) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        desktopQuery.addEventListener("change", handleDesktopChange);

        return () => {
            window.cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            desktopQuery.removeEventListener("change", handleDesktopChange);

            const focusTarget = menuButton || previouslyFocused;

            if (focusTarget instanceof HTMLElement && focusTarget.isConnected) {
                focusTarget.focus();
            }
        };
    }, [isOpen, menuButtonRef, onClose]);

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/", { replace: true });
    };

    const drawerTransition = prefersReducedMotion
        ? { duration: 0 }
        : {
            type: "spring",
            stiffness: 360,
            damping: 35,
            mass: 0.8,
        };

    return (
        <>
            <aside className={styles.desktopSidebar} aria-label="Application sidebar">
                <SidebarContent
                    indicatorId="desktop-navigation-active"
                    onLogout={handleLogout}
                    prefersReducedMotion={prefersReducedMotion}
                />
            </aside>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <>
                        <motion.div
                            className={styles.backdrop}
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: prefersReducedMotion ? 0 : 0.18,
                            }}
                            onClick={onClose}
                        />

                        <motion.aside
                            ref={drawerRef}
                            id="mobile-navigation"
                            className={styles.drawer}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Application navigation"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={drawerTransition}
                        >
                            <SidebarContent
                                closeButtonRef={closeButtonRef}
                                indicatorId="mobile-navigation-active"
                                isDrawer
                                onClose={onClose}
                                onLogout={handleLogout}
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}


export default Sidebar;
