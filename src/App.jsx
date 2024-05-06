import { useState } from 'react'
import './App.css'
import {
  useQuery, 
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import Products from './components/Products/Products.jsx'

const queryClient = new QueryClient();

export default function App() {

  return (
    <div className="card">
      <h1>React Query Example</h1>
      <QueryClientProvider client={queryClient}>
        <Products />
      </QueryClientProvider>
    </div>
  )
}

