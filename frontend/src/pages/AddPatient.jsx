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


            <h1>
                Add Patient
            </h1>


            <form onSubmit={addPatient}>


                <h2>
                    Personal Information
                </h2>



                <label>
                    First Name:
                </label>

                <br/>

                <input
                    name="first_name"
                    placeholder="First Name"
                    value={patient.first_name}
                    onChange={handleChange}
                />


                <br/><br/>



                <label>
                    Last Name:
                </label>

                <br/>

                <input
                    name="last_name"
                    placeholder="Last Name"
                    value={patient.last_name}
                    onChange={handleChange}
                />


                <br/><br/>



                <label>
                    Mobile Number:
                </label>

                <br/>

                <input
                    name="mobile"
                    placeholder="Mobile"
                    value={patient.mobile}
                    onChange={handleChange}
                />


                <br/><br/>



                <label>
                    Age:
                </label>

                <br/>

                <input
                    name="age"
                    placeholder="Age"
                    value={patient.age}
                    onChange={handleChange}
                />


                <br/>

                <hr/>



                <h2>
                    Medical Information
                </h2>



                <label>
                    Gender:
                </label>

                <br/>


                <select
                    name="gender"
                    value={patient.gender}
                    onChange={handleChange}
                >

                    <option value="MALE">
                        Male
                    </option>


                    <option value="FEMALE">
                        Female
                    </option>


                    <option value="OTHER">
                        Other
                    </option>


                </select>


                <br/><br/>



                <label>
                    Blood Group:
                </label>

                <br/>


                <input
                    name="blood_group"
                    placeholder="Blood Group"
                    value={patient.blood_group}
                    onChange={handleChange}
                />


                <br/>

                <hr/>



                <h2>
                    Contact Information
                </h2>



                <label>
                    Address:
                </label>

                <br/>


                <input
                    name="address"
                    placeholder="Address"
                    value={patient.address}
                    onChange={handleChange}
                />


                <br/>

                <hr/>



                <h2>
                    Account Information
                </h2>



                <label>
                    Password:
                </label>

                <br/>


                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={patient.password}
                    onChange={handleChange}
                />


                <br/><br/>



                <button type="submit">

                    Add Patient

                </button>


            </form>


        </div>

    );

}


export default AddPatient;