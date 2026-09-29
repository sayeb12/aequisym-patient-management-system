import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../api/axios";


function Patients() {

    const navigate = useNavigate();


    const [patients, setPatients] = useState([]);

    const loadPatients = async () => {

        try {

            const response = await api.get("/patients/");

            setPatients(response.data);

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        loadPatients();

    }, []);



    const deletePatient = async (id) => {

        try {

            await api.delete(`/patients/${id}/`);

            alert("Patient deleted");

            loadPatients();

        }
        catch (error) {

            console.log(error);

        }

    };







    return (

        <div>

            <h1>Patient List</h1>


            <table border="1">

                <thead>

                    <tr>

                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Blood Group</th>
                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>


                    {
                        patients.map((patient) => (


                            <tr key={patient.id}>


                                <td>
                                    {patient.first_name} {patient.last_name}
                                </td>


                                <td>
                                    {patient.mobile}
                                </td>


                                <td>
                                    {patient.age}
                                </td>


                                <td>
                                    {patient.gender}
                                </td>


                                <td>
                                    {patient.blood_group}
                                </td>



                                <td>


                                    <button

                                        onClick={() => {

                                            navigate(
                                                "/update-patient",
                                                {
                                                    state: {
                                                        patient: patient
                                                    }
                                                }
                                            )

                                        }}

                                    >
                                        Update
                                    </button>


                                    <button
                                        onClick={() => deletePatient(patient.id)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => {

                                            navigate(
                                                "/add-visit",
                                                {
                                                    state: {
                                                        patient: patient
                                                    }
                                                }
                                            )

                                        }}
                                    >
                                        Add Visit
                                    </button>

                                    <button

                                        onClick={() => {

                                            navigate(
                                                "/visits",
                                                {
                                                    state: {
                                                        patient: patient
                                                    }
                                                }
                                            )

                                        }}

                                    >
                                        View Visits
                                    </button>

                                    <button

                                        onClick={() => {

                                            navigate(
                                                "/view-patient",
                                                {
                                                    state: {
                                                        patientId: patient.id
                                                    }
                                                }
                                            )

                                        }}

                                    >
                                        View Patient
                                    </button>


                                </td>


                            </tr>


                        ))
                    }


                </tbody>


            </table>


        </div>

    );

}


export default Patients;