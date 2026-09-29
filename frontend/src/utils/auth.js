const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const PATIENT_KEY = "patient";


export const saveAuth = ({ access, refresh, patient }) => {
    if (!access || !refresh) {
        throw new Error("The login response did not include both JWT tokens.");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

    if (patient) {
        localStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
    } else {
        localStorage.removeItem(PATIENT_KEY);
    }
};


export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);


export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);


export const setAccessToken = (access) => {
    if (!access) {
        throw new Error("Cannot save an empty access token.");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, access);
};


export const getPatient = () => {
    const patient = localStorage.getItem(PATIENT_KEY);

    if (!patient) {
        return null;
    }

    try {
        return JSON.parse(patient);
    } catch {
        localStorage.removeItem(PATIENT_KEY);
        return null;
    }
};


export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PATIENT_KEY);
};
