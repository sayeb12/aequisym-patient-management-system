import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";


function Dashboard(){

    const [patient,setPatient] = useState(null);

    const navigate = useNavigate();


    useEffect(()=>{

        fetchPatient();

    },[]);



    const fetchPatient = async()=>{


        try{

            const response = await api.get(
                "patients/1/"
            );


            setPatient(
                response.data
            );


        }

        catch(error){

            console.log(error);

        }


    };



    const handleLogout = ()=>{


        logout();

        navigate("/");


    };



    return(

        <div>


            <h1>
                Patient Dashboard
            </h1>



            {
                patient &&

                <div>


                    <h2>
                        Patient Profile
                    </h2>


                    <p>
                        Name:
                        {" "}
                        {patient.first_name}
                        {" "}
                        {patient.last_name}
                    </p>


                    <p>
                        Mobile:
                        {" "}
                        {patient.mobile}
                    </p>


                    <p>
                        Age:
                        {" "}
                        {patient.age}
                    </p>


                    <p>
                        Blood Group:
                        {" "}
                        {patient.blood_group}
                    </p>


                    <p>
                        Total Visits:
                        {" "}
                        {patient.total_visits}
                    </p>


                    <p>
                        Last Visit:
                        {" "}
                        {patient.last_visit_date}
                    </p>


                </div>

            }



            <button onClick={handleLogout}>

                Logout

            </button>



        </div>

    );


}


export default Dashboard;