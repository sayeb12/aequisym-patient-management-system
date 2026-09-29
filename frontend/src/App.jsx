import {
    BrowserRouter,
    Routes,
    Route
}
from "react-router-dom";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";

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


            </Routes>


        </BrowserRouter>

    );


}


export default App;