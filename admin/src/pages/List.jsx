import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const [list,setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeProduct = async(id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, {headers: {token}})
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      await fetchList();
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
        <p className='mb-2'>All Products List</p>
        <div className='flex flex-col gap-2'>

        {/* List Table Tilte */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-200 bg-gray-100 text-sm'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b className='text-center'>Action</b>
          </div>


        {/* product list */}

        {
          list.map((item,index) => (
            <div key={index} className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border border-gray-200 bg-white text-sm'>
              <img src={item.image[0]} alt="" className='w-12' />
              <p className='font-medium'>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }

        </div>
    </>
  );
};

export default List;