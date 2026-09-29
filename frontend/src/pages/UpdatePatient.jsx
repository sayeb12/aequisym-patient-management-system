import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";


function UpdatePatient() {

    const location = useLocation();
    const navigate = useNavigate();


    const patient = location.state.patient;


    const [formData, setFormData] = useState({

        first_name: patient.first_name,
        last_name: patient.last_name,
        mobile: patient.mobile,
        age: patient.age,
        gender: patient.gender,
        address: patient.address,
        blood_group: patient.blood_group

    });



    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };



    const updatePatient = async () => {

        try {


            await api.put(
                `/patients/${patient.id}/`,
                {
                    ...patient,
                    ...formData
                }
            );


            alert("Patient Updated Successfully");


            navigate("/patients");


        }
        catch (error) {

            console.log(error.response?.data);

            alert(
                JSON.stringify(error.response?.data)
            );

        }

    };



    return (

        <div>


            <h1>Update Patient</h1>


            <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
            />


            <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
            />


            <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
            />


            <input
                name="age"
                value={formData.age}
                onChange={handleChange}
            />


            <select
                name="gender"
                value={formData.gender}
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



            <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
            />



            <input
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
            />



            <button
                onClick={updatePatient}
            >

                Save Changes

            </button>


        </div>


    );


}


export default UpdatePatient;