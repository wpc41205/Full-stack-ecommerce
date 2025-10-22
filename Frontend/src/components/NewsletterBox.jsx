import React from 'react'

export const NewsletterBox = () => {

    const onSubmitHandler = (e) => {
        e.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='font-medium text-2xl text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 gray-400 mt-3'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 mx-auto my-6 flex items-stretch overflow-hidden rounded-md border border-gray-300'>
            <input type='email' placeholder='Enter your email' className='w-full sm:flex-1 outline-none px-3 py-3 bg-white' />
            <button type='submit' className='bg-black text-white text-xs px-6 py-3'>SUBSCRIBE</button>
        </form>
    </div>
  ) 
}