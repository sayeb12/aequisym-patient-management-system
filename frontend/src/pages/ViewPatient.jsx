import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import api from "../api/axios";


function ViewPatient(){

    const location = useLocation();
    const navigate = useNavigate();

    const patientId = location.state.patientId;


    const [patient,setPatient] = useState(null);



    useEffect(()=>{

        const loadPatient = async()=>{

            try{

                const response = await api.get(
                    `/patients/${patientId}/`
                );

                setPatient(response.data);

            }
            catch(error){

                console.log(error);

            }

        };


        loadPatient();


    },[patientId]);



    if(!patient){

        return <h2>Loading...</h2>;

    }



    return(

        <div>

            <h1>Patient Details</h1>


            <h2>
                {patient.first_name} {patient.last_name}
            </h2>


            <p>
                Mobile: {patient.mobile}
            </p>


            <p>
                Age: {patient.age}
            </p>


            <p>
                Gender: {patient.gender}
            </p>


            <p>
                Address: {patient.address}
            </p>


            <p>
                Blood Group: {patient.blood_group}
            </p>


            <p>
                Total Visits: {patient.total_visits}
            </p>


            <p>
                Last Visit Date: {patient.last_visit_date}
            </p>


            <button
            onClick={()=>navigate("/patients")}
            >
                Back
            </button>


        </div>

    );


}


export default ViewPatient;