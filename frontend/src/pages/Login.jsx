import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { saveTokens } from "../utils/auth";


function Login(){

    const navigate = useNavigate();


    const [mobile,setMobile] = useState("");
    const [password,setPassword] = useState("");


    const handleLogin = async(e)=>{

        e.preventDefault();


        try{

            const response = await api.post(
                "login/",
                {
                    mobile: mobile,
                    password: password
                }
            );


            console.log(response.data);


            saveTokens(
                response.data.access,
                response.data.refresh
            );


            alert(
                "Login Successful"
            );


            navigate("/dashboard");


        }

        catch(error){

            console.log(error.response);


            alert(
                "Invalid mobile or password"
            );

        }


    };


    return(

        <div>


            <h1>
                Patient Login
            </h1>


            <form onSubmit={handleLogin}>


                <input

                    type="text"

                    placeholder="Mobile Number"

                    value={mobile}

                    onChange={
                        (e)=>setMobile(e.target.value)
                    }

                />


                <br/>


                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={
                        (e)=>setPassword(e.target.value)
                    }

                />


                <br/>


                <button type="submit">

                    Login

                </button>


            </form>


        </div>


    );


}


export default Login;