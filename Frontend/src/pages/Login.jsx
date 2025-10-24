import React, { useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login')
  const { token, setToken, navigate, getCartData } = useContext(ShopContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://full-stack-ecommerce-backend-psi.vercel.app';

  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {

      if(currentState === 'Sign Up'){

        const response = await axios.post(backendUrl + '/api/user/register', {name: name,email: email,password: password});
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token);
          getCartData(); // Load cart data after registration
          navigate('/'); // Navigate to home page after successful registration
        }
        else{
          toast.error(response.data.message);
        }

      }else{
       
        const response = await axios.post(backendUrl + '/api/user/login', {email: email,password: password});
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token);
          getCartData(); // Load cart data after login
          navigate('/'); // Navigate to home page after successful login
        }
        else{
          toast.error(response.data.message);
        }

      }

    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr  className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState === 'Login' ? ' ' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
          ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login