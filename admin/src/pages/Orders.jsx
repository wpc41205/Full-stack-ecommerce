import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Orders = ({token}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {

    if(!token){
      return null;
    }

    try {

      const response = await axios.get(`${backendUrl}/api/order/list`, {headers:{token: token}});
      if(response.data.success) {
        setOrders(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    }catch(error){
      toast.error(error.message);
    }
  }

  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
    
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, {
        orderId: orderId,
        status: newStatus
      }, {headers: {token: token}});
      
      if(response.data.success) {
        toast.success("Order status updated successfully");
        // Update the local state
        setOrders(orders.map(order => 
          order._id === orderId ? {...order, status: newStatus} : order
        ));
      } else {
        toast.error(response.data.message);
      }
    } catch(error) {
      toast.error("Failed to update order status");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
            orders.map((order,index) => (
              <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              {/* Column 1: Image */}
              <img src={assets.parcel_icon} alt="" />
              
              {/* Column 2: Product + Address */}
              <div>
                <div className='mb-2'>
                  {order.items.map((item,itemIndex)=>{
                    if (itemIndex === order.items.length - 1) {
                      return <p className='py-0.5' key={itemIndex}> {item.name} x {item.quantity} ({item.size})</p>
                    }
                    else {
                      return <p className='py-0.5' key={itemIndex}> {item.name} x {item.quantity} ({item.size}), </p>
                    }
                  })}
                </div>
                <div>
                  <p className='mt-3 mb-2 font-medium'>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
              </div>
              
              {/* Column 3: Items, Method, Payment, Date */}
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              
              {/* Column 4: Currency */}
              <p className='text-sm sm:text-[15px]'>{currency} {order.amount}</p>
              
              {/* Column 5: Select dropdown */}
              <select value={order.status} onChange={(e)=>handleStatusChange(e,order._id)} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out of Delivery">Out of Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders