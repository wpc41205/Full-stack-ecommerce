import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title'
import ProductItem from '../components/ProductItem';


const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sort, setSort] = useState('relevance');

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  useEffect(() => {
    let data = [...products];
    if (category.length) {
      data = data.filter(p => category.includes(p.category));
    }
    if (subCategory.length) {
      data = data.filter(p => subCategory.includes(p.subCategory));
    }
    if (search) {
      data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'low-high') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
      data.sort((a, b) => b.price - a.price);
    } else {
      data.sort((a, b) => (b.date || 0) - (a.date || 0));
    }
    setFilteredProducts(data);
  }, [products, category, subCategory, sort, search]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t-[0.5px] border-gray-200'>

      {/* Filter Column (left) */}
      <div className='min-w-[15rem]'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTER
          <img className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
          
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORY</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/>Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/>Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/>kids
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Product Column (right) */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={`ALL`} text2={`COLLECTION`}/>
          {/* Product Sort */}
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className='border border-gray-300 text-sm px-2 py-1'>
            <option value="relevance">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low-High</option>
            <option value="high-low">Sort by: High-Low</option>
          </select>
        </div>
        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filteredProducts.map((item, index) => (
            <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Collection