import { useState } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";


function AddVisit(){

    const navigate = useNavigate();
    const location = useLocation();

    const patient = location.state.patient;


    const [form, setForm] = useState({

        patient: patient.id,
        doctor_name:"",
        visit_date:"",
        clinical_note:""

    });


    const handleChange = (e)=>{

        setForm({

            ...form,
            [e.target.name]:e.target.value

        });

    };


    const submitVisit = async(e)=>{

        e.preventDefault();


        try{

            await api.post(
                "/patient-visits/",
                form
            );


            alert("Visit Added Successfully");

            navigate("/patients");


        }
        catch(error){

            console.log(error);

            alert("Failed to add visit");

        }


    };



    return(

        <div>

            <h1>Add Patient Visit</h1>


            <h3>
                Patient: {patient.first_name} {patient.last_name}
            </h3>


            <form onSubmit={submitVisit}>


                <input

                name="doctor_name"

                placeholder="Doctor Name"

                value={form.doctor_name}

                onChange={handleChange}

                />

                <br/>


                <input

                type="date"

                name="visit_date"

                value={form.visit_date}

                onChange={handleChange}

                />

                <br/>


                <textarea

                name="clinical_note"

                placeholder="Clinical Note"

                value={form.clinical_note}

                onChange={handleChange}

                />


                <br/>


                <button type="submit">

                    Save Visit

                </button>


            </form>


        </div>

    );

}


export default AddVisit;