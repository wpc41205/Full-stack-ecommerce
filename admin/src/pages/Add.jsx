import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Add = () => {

  const [image1,setImage1] = useState(null);
  const [image2,setImage2] = useState(null);
  const [image3,setImage3] = useState(null);
  const [image4,setImage4] = useState(null);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: 'Men',
    subCategory: 'Topwear',
    price: '',
    sizes: [],
    isBestseller: false
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image uploads
  const handleImageUpload = (e, imageNumber) => {
    const file = e.target.files[0];
    if (file) {
      switch(imageNumber) {
        case 1: setImage1(file); break;
        case 2: setImage2(file); break;
        case 3: setImage3(file); break;
        case 4: setImage4(file); break;
        default: break;
      }
    }
  };

  // Handle size toggle
  const handleSizeToggle = (size) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add text data
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('subCategory', productData.subCategory);
      formData.append('price', productData.price);
      formData.append('sizes', JSON.stringify(productData.sizes));
      formData.append('bestseller', productData.isBestseller.toString());

      // Add images
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:4000/api/product/add', {
        method: 'POST',
        headers: {
          'token': token
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product added successfully!');
        // Reset form
        setProductData({
          name: '',
          description: '',
          category: 'Men',
          subCategory: 'Topwear',
          price: '',
          sizes: [],
          isBestseller: false
        });
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error('Failed to add product: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='flex flex-col w-full items-start gap-3 p-4'>
      <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img 
                className='w-20 h-20 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400' 
                src={image1 ? URL.createObjectURL(image1) : assets.upload_area} 
                alt="Upload Image 1" 
              />
              <input 
                type="file" 
                id="image1" 
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 1)}
              />
            </label>
            <label htmlFor="image2">
              <img 
                className='w-20 h-20 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400' 
                src={image2 ? URL.createObjectURL(image2) : assets.upload_area} 
                alt="Upload Image 2" 
              />
              <input 
                type="file" 
                id="image2" 
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 2)}
              />
            </label>
            <label htmlFor="image3">
              <img 
                className='w-20 h-20 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400' 
                src={image3 ? URL.createObjectURL(image3) : assets.upload_area} 
                alt="Upload Image 3" 
              />
              <input 
                type="file" 
                id="image3" 
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 3)}
              />
            </label>
            <label htmlFor="image4">
              <img 
                className='w-20 h-20 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400' 
                src={image4 ? URL.createObjectURL(image4) : assets.upload_area} 
                alt="Upload Image 4" 
              />
              <input 
                type="file" 
                id="image4" 
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 4)}
              />
            </label>
          </div>
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-1'>Product name</p>
          <input 
            className='w-full px-3 py-2 border border-gray-300 rounded' 
            type="text" 
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder='Type here' 
            required
          />
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-1'>Product description</p>
          <textarea 
            className='w-full px-3 py-2 border border-gray-300 rounded resize-none' 
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder='Write content here'
            rows="4"
            required
          />
        </div>

        <div className='flex gap-4 w-full max-w-[500px]'>
          <div className='flex-1'>
            <p className='mb-1'>Product category</p>
            <select 
              className='w-full px-3 py-2 border border-gray-300 rounded'
              name="category"
              value={productData.category}
              onChange={handleChange}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className='flex-1'>
            <p className='mb-1'>Sub category</p>
            <select 
              className='w-full px-3 py-2 border border-gray-300 rounded'
              name="subCategory"
              value={productData.subCategory}
              onChange={handleChange}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className='flex-1'>
            <p className='mb-1'>Product Price</p>
            <input 
              className='w-full px-3 py-2 border border-gray-300 rounded' 
              type="number" 
              name="price"
              value={productData.price}
              onChange={handleChange}
              placeholder='25'
              required
            />
          </div>
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-2'>
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded font-medium ${
                  productData.sizes.includes(size)
                    ? 'bg-[#c586a5] text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className='w-full max-w-[500px] flex items-center gap-2'>
          <input 
            type="checkbox" 
            id="bestseller"
            name="isBestseller"
            checked={productData.isBestseller}
            onChange={handleChange}
            className='w-4 h-4'
          />
          <label htmlFor="bestseller" className='text-sm'>Add to bestseller</label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded font-medium uppercase ${
            loading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {loading ? 'ADDING...' : 'ADD'}
        </button>
      </form>
    </div>
  )
}

export default Add