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

const categories_url = api_urls.find((u) =>  u.name == 'categories' && u.environment == 'production' );
const products_url = api_urls.find((u) => u.name == 'products' && u.environment == 'production' ); 
console.log('categories_url: ' + categories_url.url);


const queryClient = new QueryClient();

const CatalogThree = () => {
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

  return(
    <>
      <QueryClientProvider client={queryClient}>
        <ul className="categories">
          {categories.map(category => (
            <Category category={category}  />

          ))}
        </ul>
      </QueryClientProvider>

    </>
  )
}


const fetchCategories = async () => {
  console.log('====> fetchCategories: ' + categories_url);
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


export default CatalogThree;