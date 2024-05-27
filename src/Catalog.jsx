import { useState, useEffect } from 'react'
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from 'axios'
import './Categories.css'
import './Catalog.css'

const queryClient = new QueryClient();



const Catalog = () => {
  const [categoryPermalink, setCategoryPermalink] = useState('stickers');
  
  const [products, setProducts] = useState('');
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Categories categoryPermalink={categoryPermalink} setCategoryPermalink={setCategoryPermalink}
        products={products} setProducts={setProducts} />
        <Products categoryPermalink={categoryPermalink} products={products} setProducts={setProducts} />
      </QueryClientProvider>
    </>
  ); 
}



const Categories = ({ categoryPermalink, setCategoryPermalink, products, setProducts }) => {
  const [categories, setCategories] = useState([]);
  
  const { error, data, isLoading } = useQuery({
    queryKey: ['fetchCategories'],
    queryFn: fetchCategories
  });
  
  useEffect(() => {
    if(data) {
      setCategories(data);
    }
  }, [data]);
  
  if (isLoading) return 'Loading...';
  if (error) return 'Oops an error happened: ' + error.message;
  
  function clickCategory(permalink) {
    console.log('==> click button ' + permalink);
    
    setCategoryPermalink(permalink);
    
    document.querySelectorAll('.category a').forEach((item) => {
      item.classList.remove('active');
    });
    
    active == 'active' ? setActive('') : setActive('active');
    console.log('====> active is: ' + active);
    return false;
  }
  
  return (
    <>
      <ul key="categoriesList" className="categories">
        {categories.map((category) => (
          <li id={ 'category_' + category.id} key={ 'category_' + category.id} className="category">
            <a className={ category.permalink == categoryPermalink ? 'active' : '' } onClick={() => clickCategory(category.permalink)}>{category.name}</a>
            <p className="categoryDescription">{category.description}</p>
          </li>
        ))}
      </ul>
    </>
  )  
}



const Products = ({ categoryPermalink, products, setProducts }) => {
  
  if( typeof categoryPermalink === 'undefined' ) {
    categoryPermalink = 'Dogs';
  }
  
  const { error, data, isLoading } = useQuery({
    queryKey: ['categoryPermalink', categoryPermalink],
    queryFn: () => fetchProducts(categoryPermalink),
  });
  
  useEffect(() => {
    if(data) setProducts(data);
  }, [data]);
  
  if (isLoading) return 'Loading...';
  if (error) return 'Oops an error happened: ' + error.message;
  
  return (
    <ul key="productsList" className="products">
      {data.map(product => <Product product={product} /> )}
    </ul>
  )
}



const Product = ({product}) => {
  return (
    <>
      <li key={product.id}>
        <h3 className="productName">{product.name}</h3>
        <div className="photoFrame">
          
        </div>
        <p className="productPrice">{currencyFormat(product.price)}</p>
      </li>
    </>
  )
}



const fetchCategories = async () => {
  const { data } = await axios.get('http://localhost:3000/categories.json').then((data) => data);
  return data;
};

const fetchProducts = async (permalink) => {
  const { data } = await axios.get('http://localhost:3000/categories/' + permalink + '.json').then((data) => data);
  return data;
};



const currencyFormat = (value) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);



export default Catalog;