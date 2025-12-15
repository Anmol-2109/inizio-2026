import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ name:"", email:"", password:"" });
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/auth/register/", data);
    navigate(`/verify-otp?email=${data.email}`);
  };

  return (
    <>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e=>setData({...data,name:e.target.value})}/>
      <input placeholder="Email" onChange={e=>setData({...data,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e=>setData({...data,password:e.target.value})}/>
      <button onClick={submit}>Register</button>
    </>
  );
}
