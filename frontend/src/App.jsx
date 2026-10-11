import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import AddPatient from "./pages/AddPatient";
import AddVisit from "./pages/AddVisit";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import UpdatePatient from "./pages/UpdatePatient";
import ViewPatient from "./pages/ViewPatient";
import Visits from "./pages/Visits";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<AppLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="patients" element={<Patients />} />
                    <Route path="add-patient" element={<AddPatient />} />
                    <Route path="add-visit" element={<AddVisit />} />
                    <Route path="visits" element={<Visits />} />
                    <Route path="update-patient" element={<UpdatePatient />} />
                    <Route path="view-patient" element={<ViewPatient />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


export default App;
