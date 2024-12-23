import { 
  React, 
  useState, 
  useEffect } from "react";
import {
  useQuery
} from "@tanstack/react-query";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import "./Catalog.scss";
import { catalog_url } from "./config.js";
import usePersistState from "./usePersistState.js";
import currencyFormat from "./currency_format.js";
import Cart from "./Cart.jsx";
import Category from "./Category.jsx";
import Products from "./Products.jsx";
import ProductDetails from "./ProductDetails.jsx";



const fetchCatalog = async () => {
  const { data } = await axios.get(catalog_url);
  return data;
};

export default () => {
  const [permalink, setPermalink] = useState(window.location.pathname.replace("/", ""));
  const [activeCategory, setActiveCategory] = useState();
  const [activeProduct, setActiveProduct] = useState();
  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [cart, setCart] = usePersistState("cart", []);

  const onClickCategory = (category) => {
    setActiveCategory(category);
    setPermalink(category.permalink);
    window.history.pushState(
      { id: category.permalink },
      category.name,
      category.permalink
    );
  };

  const onClickProduct = (product) => {
    console.log(']]]]] clicked product: ' + product.name);
    //showOverlay();
    setActiveProduct(product);
    /*
    window.history.pushState(
      { id: product.id },
      product.name,
      '/' + product.permalink
    );*/
  }

  const showOverlay = () => {
    document
      .querySelector("body")
      .insertAdjacentHTML("beforeend", '<div class="overlay"></div>');
    document
      .querySelector(".overlay")
      .addEventListener("click", () => removeOverlay());
  };
  
  const removeOverlay = () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      setActiveProduct(null);
      overlay.remove();

      /*
      window.history.pushState(
        { id: activeCategory.permalink },
        activeCategory.name,
        activeCategory.permalink
      ); */
    }
  };

  const addToCart = ({product}) => {
    console.log('>>>>> add product to cart: ' + product.name);
    const duplicate = cart.find((c) => c.product.id === product.id);
    
    if( duplicate ) {
      console.log('>>> duplicate found');
      console.dir(duplicate);
      
      const new_cart = cart.map((c) => {
        if(c.product.id === product.id) {
          console.log('>>> incrementing quantity because duplicate found - quanity: ' + c.quantity);
          return {quantity: c.quantity++, product: c.product};
        } else {
          return {quantity: c.quantity, product: c.product};
        }
      });
      setCart((new_cart) => new_cart);
      console.log('>>> cart after incrementing quantity');
      console.dir(cart);
    } else {
      setCart((cart) => [...cart, {quantity: 1, product: product}]);
    }
    
  }

  const clearCart = () => {
    setCart([]);
  }

  const removeFromCart = (product) => {
    console.log('>>>>> remove product from cart: ' + product.name);
    
    const new_cart = cart.filter((item) => {
      if(item.product.id === product.id) {
        if(item.quantity > 1) {
          console.log('>>> decrementing quantity because quantity is greater than 1 - quanity: ' + item.quantity);
          return {quantity: item.quantity--, product: item.product};
        } else {
          console.log('>>> quanity is 1, removing item from cart');
        }
      } else {
        return {quantity: item.quantity, product: item.product};
      }
    })
    
    console.log('>> new_cart in removeFromCart');
    console.dir(new_cart);
    setCart(() => new_cart);
  }

  const closeProduct = () => {
    setActiveProduct(null);
    removeOverlay();
    //setPermalink(activeCategory.permalink);
  }

  const getCategories = (cat) => {
    // process catalog data to produce array of category objects
    return cat.map((c) => c.active_categories)
      .flat().filter((value, index, self) => 
        index === self.findIndex((i) => 
          ( i.permalink === value.permalink ))
    )
  };

  const getProducts = (catalog, category_permalink) => {
    // process catalog data to produce array of product objects
    return catalog.filter((product) => 
      product.active_categories.map((active_cat) => 
        active_cat.permalink).includes(category_permalink)
    )
  }

  const getFeaturedProducts = (catalog) => {
    return catalog.filter((product) => 
      product.featured === true
    )
  }

  const { data: catalogData, isLoading: catalogIsLoading, error: catalogError } = 
  useQuery({
    queryKey: ["fetchCatalog"],
    queryFn: fetchCatalog,
  });


  useEffect(() => {
    if(catalogData) {
      setCategoriesData( getCategories(catalogData) );
      
      console.log(']]]]] permalink: -' + permalink + '-');
      if(permalink !=='') {
        setActiveCategory(categoriesData.find((c) => c.permalink === permalink));
        setProductsData(getProducts(catalogData, permalink));
      } else {
        //setActiveCategory(categoriesData.find((c) => c.permalink === 'featured'));
        setProductsData(getFeaturedProducts(catalogData));
      }

    }
  }, [catalogData, permalink]);

  if (catalogIsLoading) return "Loading...";
  if (catalogError) return "Oops an error happened: " + catalogError.message;
  
  
  return (
    <div className="catalog">
      <Cart cart={cart} setCart={setCart} clearCart={clearCart} removeFromCart={removeFromCart} />
      <ul className="categories">
        {categoriesData.map((category) => (
          <Category
            key={category.id}
            category={category}
            activeCategory={activeCategory}
            onClickCategory={onClickCategory}
          />
        ))}
        
      </ul>
      {productsData && <Products products={productsData} activeCategory={activeCategory} onClickProduct={onClickProduct} />}
      {activeProduct && <ProductDetails product={activeProduct} addToCart={addToCart} closeProduct={closeProduct} />}
    </div>
  );
};







