"use client"
import React from 'react'
import CardPopularProducts from './CardPopularProducts'
import CardSalesSummary from './CardSalesSummary'
import CardPurchaseSummary from './CardPurchaseSummary'
import CardExpenseSummary from './CardExpenseSummary'



const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 xl:overflow-auto custom-grid-rows">
      <CardPopularProducts/>
      <CardSalesSummary/>
      <CardPurchaseSummary/>
      <CardExpenseSummary/>
      <div className='md:row-span-1 xl:row-span-2 bg-gray-600'/>
      <div className='md:row-span-1 xl:row-span-2 bg-gray-600'/>
      <div className='md:row-span-1 xl:row-span-2 bg-gray-600'/>
    </div>
  )
}

export default Dashboard