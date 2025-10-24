import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Navbar = () => {

    const [visible, setVisible] = useState(false);

    const { setShowSearch, getCartCount,navigate, token, setToken, setCartItem} = useContext(ShopContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setCartItem({});
        toast.success('Logged out successfully');
        navigate('/login');
    }

  return (
    <div className='flex justify-between items-center py-5 font-medium'>
        
        <Link to='/'><img src={assets.logo} alt="logo" className='w-36' /></Link>
        
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
            <NavLink to='/' className='flex flex-col items-center gap-1'>
                <p>HOME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/collection' className='flex flex-col items-center gap-1'> 
                <p>COLLECTIONS</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1'>
                <p>ABOUT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                <p>CONTACT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <a href="https://full-stack-ecommerce-admin-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className='border border-gray-200 px-5 text-xs py-1 rounded-full -mt-2'>
                <p className='mt-1'>Admin Panel</p>
            </a>
        </ul>

        <div className='flex items-center gap-6'>
            <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="search" className='w-5' />
            <div className='group relative'>    
                <Link to={token ? '/profile' : '/login'}><img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" /></Link>
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'> 
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                        <Link to='/profile'><p className='cursor-pointer hover:text-black'>My Profile</p></Link>
                        <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                        <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>
            </div>
            <Link to='/cart' className='relative'>
                <img src={assets.cart_icon} alt="cart" className='w-5 min-w-5' />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>
            <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="menu" className='w-5 cursor-pointer sm:hidden' />
        </div>
       {/* {Sidebar menu for smaill screens} */}
       <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>   
            <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                <img className='h-4 rotate-180' src={assets.dropdown_icon} alt=""/>
                <p>Back</p>
            </div>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/'>HOME</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/about'>ABOUT</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/contact'>CONTACT</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/admin'>ADMIN PANEL</NavLink>
        </div>
       </div>

    </div>
  )
}

export default Navbar 