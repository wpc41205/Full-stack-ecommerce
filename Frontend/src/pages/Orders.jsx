import React,{ useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Order = () => {

  const { backendUrl, token , currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async () => {
    try {
      if(!token){
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      
      if(response.data.success){
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          })
          return allOrdersItem;
        })
        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <div className='border-t pt-16 border-gray-300'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      <div>
        {
          orderData.map((item,index)=>(
            <div key={index} className='py-4 border-t border-b border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity }</p>
                    <p>Size: {item.size }</p>
                  </div>
                  <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toLocaleDateString()}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className={`min-w-2 h-2 rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-500' :
                    item.status === 'shipped' ? 'bg-blue-500' :
                    item.status === 'delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></p>
                  <p className='text-sm md:text-base capitalize'>{item.status || 'Ready to ship'}</p>
                </div>
                <button className='border px-4 py-2 text-sm font-medium rounded-sm border-gray-200 cursor-pointer'>Track Order</button>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Order