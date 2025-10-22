import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem,setCartItem] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId,size) => {

        if(!size){
            toast.error('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItem);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);

        if(token){
            try {
                
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers:{token}});

            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItem){
            for(const item in cartItem[items]){
                try{
                    if (cartItem[items][item] > 0){
                        totalCount += cartItem[items][item];
                    }
                }
                catch(error){
                    console.log(error);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {

        let cartData = structuredClone(cartItem);

        cartData[itemId][size] = quantity;

        setCartItem(cartData)

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItem){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItem[items]){
                try{
                    if (cartItem[items][item] > 0){
                        totalAmount += itemInfo.price * cartItem[items][item]
                    }
                } catch (error){

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try{
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.data);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch(error){
            console.log(error.response.data);
            toast.error(error.response.data.message);
        }
    }

    const getCartData = async () => {
        if(token){
            try{
                const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}});
                if(response.data.success){
                    setCartItem(response.data.cartData);
                }
            }
            catch(error){
                console.log(error);
            }
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}});
            if(response.data.success){
                setCartItem(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getProductsData();
        // Load token from localStorage on app start
        const savedToken = localStorage.getItem('token');
        if(savedToken){
            setToken(savedToken);
        }
    },[]);

    useEffect(()=>{
        getCartData();
    },[token]);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        setCartItem,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        getCartData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;