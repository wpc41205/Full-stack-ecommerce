import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const locations = useLocation();

    useEffect(() => {
        if(locations.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [locations]);

  return showSearch && visible ? (
    <div className='border-t-[0.5px] border-b-[0.5px] border-gray-200 bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2'>
            <input type='text' placeholder='Search' className='flex-1 outline-none bg-inherit text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
            <img src={assets.search_icon} alt="search" className='w-5' />
        </div>
        <img src={assets.cross_icon} alt="cross" className='inline w-3 cursor-pointer' onClick={() => setShowSearch(false)} />
    </div>
  ) : null;
}

export default SearchBar    