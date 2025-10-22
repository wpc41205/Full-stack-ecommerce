import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
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

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order,index) => (
            <div key={index}>
              <img src={assets.parcel_icon} alt="" />
              <div>
                {order.items.map((item,itemIndex)=>{
                  if (itemIndex === order.items.length - 1) {
                    return <p key={itemIndex}> {item.name} x {item.quantity} ({item.size})</p>
                  }
                  else {
                    return <p key={itemIndex}> {item.name} x {item.quantity} ({item.size}), </p>
                  }
                })}
              </div>
              <p>{order.address.firstname} {order.address.lastname}</p>
              <div>
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders