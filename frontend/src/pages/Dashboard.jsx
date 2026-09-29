import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { getAccessToken, logout } from "../utils/auth";


function Dashboard() {
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            const accessToken = getAccessToken();
            console.log("Sending token:", accessToken);

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
                console.error("Could not load profile:", error.response?.data ?? error);

                if (!isMounted) {
                    return;
                }

                if (error.response?.status === 401) {
                    logout();
                    navigate("/", { replace: true });
                } else {
                    setErrorMessage("Could not load your profile. Please try again.");
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


    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };


    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }


    return (
        <div>
            <h1>Patient Dashboard</h1>

            {errorMessage && <p role="alert">{errorMessage}</p>}

            {patient && (
                <div>
                    <h2>Patient Profile</h2>
                    <p>Name: {patient.name}</p>
                    <p>Mobile: {patient.mobile}</p>
                    <p>Age: {patient.age}</p>
                    <p>Gender: {patient.gender}</p>
                    <p>Blood Group: {patient.blood_group}</p>
                    <p>Total Visits: {patient.total_visits}</p>
                    <p>Last Visit: {patient.last_visit_date}</p>
                </div>
            )}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}


export default Dashboard;
