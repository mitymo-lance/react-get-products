export default function Products(props) {
  let permalink = props.category_permalink;
  if( typeof permalink == 'undefined' ) permalink = 'dogs';
  
  
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['permalink'],
    queryFn: () => 
      axios
        .get('http://localhost:3000/categories/' + permalink + '.json')
        .then((res) => res.data),
  })
  
  console.log('isPending: ' + isPending);
  console.log('error: ' + error);
  
  if (isPending) return 'Loading...';
  if (error) return 'Oops an error happened: ' + error.message;
  
  return (
    <ul key="productsList" className="products">
      {products.map((product) => (
        <Product product={product} />
      ))}
    </ul>
  )
  
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
}

