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
  if (error) return 'Oops an error happened: ' + error.message;
  
  return (
    <>
      <ul key="categoriesList" className="categories">
        {data.map((category) => (
          <Category category={category} />
        ))}
      </ul>
    </>
  )
  
  function Category(props) {
    const [active, setActive] = useState('');
    const category = props.category;
    
    function clickCategory(permalink) {
      console.log('==> click button ' + permalink);
      
      const category_buttons = document.querySelectorAll('.category a').forEach((item) => {
        item.classList.remove('active');
      });
      
      active == 'active' ? setActive('') : setActive('active');
      console.log('====> active is: ' + active);
      return false;
    }
    
    return (
      <li id={ 'category_' + category.id} key={ 'category_' + category.id} className="category">
        <a className={active} onClick={() => clickCategory(category.permalink)}>{category.name}</a>
        <p className="categoryDescription">{category.description}</p>
      </li>
    )
  }
}

