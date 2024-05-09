import { useState } from 'react'
import './App.css'
import {
  useQuery, 
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import Products from './Products.jsx'
import Categories from './Categories.jsx'

const queryClient = new QueryClient();

export default function App() {

  return (
    <>
      <div className="card">
        <h1>React Query Example</h1>
      </div>
      
      <QueryClientProvider client={queryClient}>
        <div className="card">    
          <Categories />
        </div>
        <div className="card">
          <Products />
        </div>
      </QueryClientProvider>
    </>    
  )
}

