import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import './Categories.css'

export default function Categories() {
  
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: () => 
      axios
        .get('http://localhost:3000/categories.json')
        .then((res) => res.data),
  })
  
  if (isPending) return 'Loading...';
  if (error) return 'Oops and error happened: ' + error.message;
  
  function Category(props) {
    const [active, setActive] = useState('');
    const category = props.category;
    
    function clickCategory(i) {
      if( active == 'active' ) {
        setActive('');
      } else {
        setActive('active');
      }
    }
    
    return (
      <li id={ 'category_' + category.id} key={category.id} className="category">
        <a className={active} onClick={() => clickCategory(category.id)}>{category.name}</a>
        <p className="categoryDescription">{category.description}</p>
      </li>
    )
  }
  
  return (
    <>
      <ul key="categoriesList" className="categories">
        {data.map((category) => (
          <Category category={category} />
        ))}
      </ul>
    </>
  )
}

