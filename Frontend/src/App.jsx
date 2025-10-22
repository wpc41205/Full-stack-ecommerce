import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Order from './pages/Orders'
import Product from './pages/Product'
import Collection from './pages/Collection'
import Placeorder from './pages/Placeorder'
import About from './pages/About'
import Contact from './pages/contact'
import Cart from './pages/Cart'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div className='min-h-screen flex flex-col px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='flex-grow'>
        <ToastContainer />
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/product/:productsId' element={<Product />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/place-order' element={<Placeorder />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App