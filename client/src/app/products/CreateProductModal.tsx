import React, { useState } from 'react'
import { v4 } from 'uuid';
import Header from '../(components)/Header';

type ProductFormData = {
    name: string;
    price: number;
    stockQuantity: number;
    rating: number;
   
}

type CreateProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate:(formData: ProductFormData) => void;
}

const CreateProductModal = ({isOpen, onClose, onCreate}: CreateProductModalProps) => {
    const [formData, setFormData] = useState({
        productId: v4(),
        name: "",
        price: 0,
        stockQuantity: 0,
        rating: 0,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onCreate(formData);
        onClose();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]:
            name === "price" || name === "stockQuantity" || name === "rating" ? parseFloat(value) : value,
        });
    }
    const labelCssStyles = 'block text-sm font-medium text-gray-700';
    const inputCssStyles = 'block mb-2 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
    if(!isOpen) return null;

        
  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-auto h-full w-full z-20'>
        <div className='relative top-20 mx-auto p-5 border w-97 shadow-lg rounded-md bg-white'>
            <Header name='Create New Product' />
            <div className='mt-5'>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <label htmlFor='productName' className={labelCssStyles}>
                        Product Name
                    </label>
                    <input 
                        type='text'
                        value={formData.name}
                        onChange={handleChange}
                        name='name'
                        placeholder='Enter product name'
                        className={inputCssStyles}
                        required
                    />
                    <label htmlFor='productPrice' className={labelCssStyles}>
                        Price
                    </label>
                    <input 
                        type='number'
                        value={formData.price}
                        onChange={handleChange}
                        name='price'
                        placeholder='Enter product price'
                        className={inputCssStyles}
                        required
                        min={0}
                    />
                    <label htmlFor='stockQuantity' className={labelCssStyles}>
                        Stock Quantity      
                    </label>
                    <input 
                        type='number'
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        name='stockQuantity'
                        placeholder='Enter product stock quantity'
                        className={inputCssStyles}
                        required
                        min={0}
                    />
                    <label htmlFor='productRating' className={labelCssStyles}>
                        Rating
                        </label>
                    <input 
                        type='number'
                        id='productRating'
                        value={formData.rating}
                        onChange={handleChange}
                        name='rating'
                        placeholder='Enter product rating'
                        className={inputCssStyles}
                        required
                        min={0}
                        max={5}
                    />
                    <button 
                        type='submit'
                        className=' mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                    >
                        Create
                    </button>
                    <button 
                        type='button'
                        className='ml-2 px-4 py-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CreateProductModal