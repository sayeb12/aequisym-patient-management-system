import {
    BrowserRouter,
    Routes,
    Route
}
from "react-router-dom";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import AddVisit from "./pages/AddVisit";
import Visits from "./pages/Visits";
import UpdatePatient from "./pages/UpdatePatient";

function App(){


    return(

        <BrowserRouter>


            <Routes>


                <Route

                    path="/"

                    element={<Login/>}

                />


                <Route

                    path="/dashboard"

                    element={<Dashboard/>}

                />

                <Route 
                    path="/patients"

                    element={<Patients/>}
                />

                <Route
                    path="/add-patient"
                    element={<AddPatient/>}
                />

                <Route 
                    path="/add-visit"
                    element={<AddVisit/>}
                />

                <Route
                    path="/visits"
                    element={<Visits/>}
                />

                <Route
                    path="/update-patient"
                    element={<UpdatePatient/>}
                />


            </Routes>


        </BrowserRouter>

    );


}


export default App;