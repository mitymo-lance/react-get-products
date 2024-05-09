import {
  useQuery, 
} from '@tanstack/react-query'
import axios from 'axios'


export default function Products() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: () => 
      axios
        .get('/products.json')
        .then((res) => res.data),
  })
  
  if (isPending) return 'Loading...';
  
  if (error) return 'Oops and error happened: ' + error.message;
  
  return (
    <ul key="productsList" className="products">
      {data.map((product) => (
        <Product product={product} />
      ))}
    </ul>
  )
}

function Product(props) {
  const product = props.product;
  
  return (
    <li key={product.id}>
      <h2 className="productName">{product.name}</h2>
      <p>{product.description}</p>
      <p className="productPrice">{product.price}</p>
    </li>
  )
  
}