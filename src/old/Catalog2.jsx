import { 
  React, 
  useState, 
  useEffect } from "react";
import {
    useQuery,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import "./Catalog.scss";
import "./_buttons.css";
import { api_urls } from  "./_api_urls.js";

const queryClient = new QueryClient();
console.log('queryClient: ' + queryClient);

const categories_url = api_urls.find((u) =>  u.name == 'categories' && u.environment == 'production' );
const products_url = api_urls.find((u) => u.name == 'products' && u.environment == 'production' ); 

console.log('categories_url: ' + categories_url.url);

const Catalog2 = () => {
  const [categories, setCategories] = useState([]);
  const [categoryID, setCategoryID] = useState(0);

  const handleClickCategory = (event, category) => {
    event.stopPropagation();
    console.log('category: ' + category);

    window.history.pushState(
      { id: category.permalink },
      category.name,
      permalink,
    );

    document.querySelectorAll(".category a").forEach((item) => {
      item.classList.remove("active");
    });
  }

  const { error, data, isLoading } = useQuery({
    queryKey: ["fetchCategories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  if (isLoading) return "Loading...";
  if (error) return "Oops an error happened: " + error.message;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="catalog">    
          <ul className="categories">
            {categories.map(cat => (
              <li
                key={"category_" + cat.id}
                id={"category_" + cat.id}
                className="category"
                permalink={cat.permalink}
                name={cat.name}  
              >
                <a 
                  className={cat.permalink == categories[categoryID].permalink ? "active" : ""}
                  onClick={(event) => handleClickCategory(event, cat)}>{cat.name}</a>
              </li>
            ))}
          </ul>

          <div className="card">
            <h2>{categories_url.url}</h2>
            <h3>{products_url.url}</h3>
          </div>
        </div>
      </QueryClientProvider>
    </>
  )
}













const fetchCategories = async () => {
  const { data } = await axios.get(categories_url).then((data) => data);
  return data;
};

const fetchProducts = async (permalink) => {
  console.log('====> fetchProducts: ' + permalink);
  const { data } = await axios
    .get(products_url + permalink)
    .then((data) => data);
  return data;
};

const currencyFormat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);




export default Catalog2;