import { useState, useEffect } from 'react'
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from 'axios'
import ReactHtmlParser from 'react-html-parser'
import './Catalog.css'

const queryClient = new QueryClient();

//const categories_url = 'http://localhost:3000/categories.json';
const categories_url = 'https://www.tangiblelabs.com/categories.json';
//const products_url = 'http://localhost:3000/products.json?category=';
const products_url = 'https://www.tangiblelabs.com/products.json?category=';



const Catalog = () => {
  const currentPermalink = getCurrentHref();
  const [categoryPermalink, setCategoryPermalink] = useState( currentPermalink );
  const [products, setProducts] = useState('');
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Categories currentPermalink={currentPermalink} categoryPermalink={categoryPermalink} setCategoryPermalink={setCategoryPermalink} />
        <Products categoryPermalink={categoryPermalink} setProducts={setProducts} />
      </QueryClientProvider>
    </>
  ); 
}



const Categories = ({ currentPermalink, categoryPermalink, setCategoryPermalink }) => {
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
  
  console.log('Categories currentPermalink: ' + currentPermalink + ', categoryPermalink: ' + categoryPermalink);
  
  function clickCategory(event, category) {
    event.stopPropagation();
    
    setCategoryPermalink(category.permalink);
    window.history.pushState( {id: category.permalink }, category.name, category.permalink);
    
    document.querySelectorAll('.category a').forEach((item) => {
      item.classList.remove('active');
    });
    
    return false;
  }
  
  return (
    <>
      <ul key="categoriesList" className="categories">
        {categories.map((category) => <Category category={category} categoryPermalink={categoryPermalink} onClickCategory={(event) => clickCategory(event, category)} />)}
      </ul>
    </>
  )  
}



const Category = ({category, categoryPermalink, onClickCategory}) => {
  
  return (
    <li id={ 'category_' + category.id} key={ 'category_' + category.id} className="category">
      <a className={ category.permalink == categoryPermalink ? 'active' : '' } onClick={onClickCategory}>{category.name}</a>
      <p className="categoryDescription">{category.description}</p>
    </li>
  )
}



const Products = ({ categoryPermalink, setProducts }) => {
  
  if( typeof categoryPermalink === 'undefined' || categoryPermalink == '' ) {
    return 'Choose a category';
  } else {
  
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
}



const Product = ({product}) => {
  return (
    <>
      <li key={ 'product_' + product.id}>
        <h3 className="productName">{product.name}</h3>
        <div className="productPhoto">
          <img src={product.main_photo} />
        </div>
        <p className="productPrice">{currencyFormat(product.price)}</p>
        <p className="productDescription">{ ReactHtmlParser (product.short_description) }</p>
      </li>
    </>
  )
}



const fetchCategories = async () => {
  const { data } = await axios.get(categories_url).then((data) => data);
  return data;
};

const fetchProducts = async (permalink) => {
  const { data } = await axios.get(products_url + permalink).then((data) => data);
  return data;
};



const getCurrentHref = () => {
  if(window.location.pathname == '/') {
    return '';
  } else {
    return window.location.pathname.substr(1, window.location.pathname.length).split('.')[0];
  } 
}



const currencyFormat = (value) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);



export default Catalog;