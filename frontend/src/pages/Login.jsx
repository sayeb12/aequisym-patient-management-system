import { useState } from "react";
import api from "../api/axios";
import { saveTokens } from "../utils/auth";


function Login(){

    const [mobile,setMobile] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = async(e)=>{

        e.preventDefault();


        try{

            const response = await api.post(
                "login/",
                {
                    mobile:mobile,
                    password:password
                }
            );


            saveTokens(
                response.data.access,
                response.data.refresh
            );


            alert("Login Successful");


        }
        catch(error){

            console.log(error);

            alert(
                "Invalid login credentials"
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