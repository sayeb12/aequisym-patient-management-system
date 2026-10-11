import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  getPatient,
  logout,
} from "../../utils/auth";
import styles from "./Topbar.module.css";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/add-patient": "Add patient",
  "/add-visit": "Add visit",
  "/visits": "Visit history",
  "/update-patient": "Update patient",
  "/view-patient": "Patient details",
};

function getDisplayName(patient) {
  if (!patient) return "";

  if (patient.name) return patient.name;

  return [patient.first_name, patient.last_name].filter(Boolean).join(" ");
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H5.75A1.75 1.75 0 0 0 4 6.75v10.5C4 18.22 4.78 19 5.75 19H10" />
      <path d="M14.5 8.5 18 12l-3.5 3.5M8.5 12H18" />
    </svg>
  );
}

function Topbar({ menuButtonRef, isNavigationOpen, onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = getPatient();
  const displayName = getDisplayName(patient);
  const mobile = patient?.mobile || "";
  const hasAccountDetails = Boolean(displayName || mobile);
  const title = PAGE_TITLES[location.pathname] || "AequiSym";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <div className={styles.headingGroup}>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-label="Open navigation"
            aria-controls="mobile-navigation"
            aria-expanded={isNavigationOpen}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </button>

          <div className={styles.headingCopy}>
            <span className={styles.eyebrow}>AequiSym workspace</span>
            <h1>{title}</h1>
          </div>
        </div>

        <div className={styles.accountActions}>
          {hasAccountDetails && (
            <div
              className={styles.account}
              aria-label={`Signed in${displayName ? ` as ${displayName}` : ""}`}
            >
              <span className={styles.avatar} aria-hidden="true">
                {displayName ? getInitials(displayName) : <UserIcon />}
              </span>
              <span className={styles.accountDetails}>
                {displayName && <strong>{displayName}</strong>}
                {mobile && <small>{mobile}</small>}
              </span>
            </div>
          )}

          <button
            type="button"
            className={styles.logoutButton}
            aria-label="Log out"
            title="Log out"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
