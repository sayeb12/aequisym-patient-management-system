import React, { useState } from "react";
import api from "../api/axios";


function AddPatient(){

    const [patient,setPatient] = useState({

        first_name:"",
        last_name:"",
        mobile:"",
        age:"",
        gender:"MALE",
        address:"",
        blood_group:"",
        password:""

    });



    const handleChange=(e)=>{

        setPatient({

            ...patient,

            [e.target.name]:e.target.value

        });

    };



    const addPatient=async(e)=>{

        e.preventDefault();


        try{


            await api.post(
                "/patients/",
                patient
            );


            alert("Patient Added Successfully");


            setPatient({

                first_name:"",
                last_name:"",
                mobile:"",
                age:"",
                gender:"MALE",
                address:"",
                blood_group:"",
                password:""

            });


        }
        catch(error){

            console.log(error);

            alert("Failed to add patient");

        }

    };



    return(

        <div>


            <h1>Add Patient</h1>


            <form onSubmit={addPatient}>


                <input
                name="first_name"
                placeholder="First Name"
                value={patient.first_name}
                onChange={handleChange}
                />


                <br/>


                <input
                name="last_name"
                placeholder="Last Name"
                value={patient.last_name}
                onChange={handleChange}
                />


                <br/>


                <input
                name="mobile"
                placeholder="Mobile"
                value={patient.mobile}
                onChange={handleChange}
                />


                <br/>


                <input
                name="age"
                placeholder="Age"
                value={patient.age}
                onChange={handleChange}
                />


                <br/>


                <input
                name="blood_group"
                placeholder="Blood Group"
                value={patient.blood_group}
                onChange={handleChange}
                />


                <br/>


                <input
                name="address"
                placeholder="Address"
                value={patient.address}
                onChange={handleChange}
                />


                <br/>


                <input
                name="password"
                placeholder="Password"
                type="password"
                value={patient.password}
                onChange={handleChange}
                />


                <br/>


                <button type="submit">
                    Add Patient
                </button>


            </form>


        </div>

    );

}


export default AddPatient;