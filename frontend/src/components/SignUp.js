import React,{useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

function SignUp() {
const [name,SetName]=useState("");
const [email,SetEmail]=useState("");
const [password,SetPassword]=useState("");
const navigate = useNavigate();

useEffect(()=>{
  const auth = localStorage.getItem('user');
  if(auth){
    navigate('/')
  }
})

const collectData= async ()=>{
    console.warn(name,email,password);
    let result = await fetch('http://localhost:5000/register',{
      method:'post',
      body:JSON.stringify({name,email,password}),
      headers:{
        'Content-Type':'application/json'
      },
    });
    result = await result.json()
    console.warn(result);
localStorage.setItem("user",JSON.stringify(result.result));
localStorage.setItem("token",JSON.stringify(result.auth));

      navigate('/')
    
}

  return (
    <div className='register'>
        <h1>Register</h1>
        
        <input type='text' className='inputBox'
        value={name} onChange={(e)=>SetName(e.target.value)} placeholder='Enter Name'/>

        <input type='text' className='inputBox' 
        value={email} onChange={(e)=>SetEmail(e.target.value)} placeholder='Enter Email'/>

        <input type='password' className='inputBox'
        value={password} onChange={(e)=>SetPassword(e.target.value)} placeholder='Enter Password'/>

        <button onClick={collectData} type='button' className='appbutton'>Sign Up</button>
        
        </div>
  )
}

export default SignUp