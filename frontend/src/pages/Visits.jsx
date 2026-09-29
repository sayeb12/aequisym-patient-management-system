import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";


function Visits(){

    const location = useLocation();

    const patient = location.state.patient;


    const [visits, setVisits] = useState([]);



    const loadVisits = async()=>{


        try{

            const response = await api.get(
                `/patients/${patient.id}/visits/`
            );


            setVisits(response.data);


        }
        catch(error){

            console.log(error);

        }


    };



    useEffect(()=>{

        loadVisits();

    },[]);



    return(

        <div>


            <h1>
                Patient Visit History
            </h1>


            <h2>

                Patient:
                {" "}
                {patient.first_name} {patient.last_name}

            </h2>



            <table border="1">


                <thead>

                    <tr>

                        <th>Doctor Name</th>

                        <th>Visit Date</th>

                        <th>Clinical Note</th>


                    </tr>


                </thead>



                <tbody>


                    {
                        visits.map((visit)=>(


                            <tr key={visit.id}>


                                <td>
                                    {visit.doctor_name}
                                </td>


                                <td>
                                    {visit.visit_date}
                                </td>


                                <td>
                                    {visit.clinical_note}
                                </td>



                            </tr>


                        ))
                    }


                </tbody>


            </table>


        </div>

    );


}


export default Visits;