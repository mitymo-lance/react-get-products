import React, { useState, useEffect } from "react";
import {
  useQuery
} from "@tanstack/react-query";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import "./Catalog.scss";
import { categories_url, products_url } from "./config.js";

const fetchCategories = async () => {
  const { data } = await axios.get(categories_url);
  return data;
};

const fetchProducts = async (permalink) => {
  const { data } = await axios.get(products_url + permalink);
  return data;
};

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState();
  const [activeProduct, setActiveProduct] = useState();
  const [cart, setCart] = useState(0);
  
  const onClickCategory = (category) => {
    setActiveCategory(category);
    window.history.pushState(
      { id: category.permalink },
      category.name,
      category.permalink
    );
  };

  const onClickProduct = (product) => {
    console.log(']]]]] clicked product: ' + product.name);
    showOverlay();
    setActiveProduct(product);
    window.history.pushState(
      { id: product.id },
      product.name,
      '/' + product.permalink
    );
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

      window.history.pushState(
        { id: activeCategory.permalink },
        activeCategory.name,
        activeCategory.permalink
      );
    }
  };

  const addToCart = ({product}) => {
    console.log('>>>>> add product to cart: ' + product.name);
    setCart(cart + 1);
  }

  const clearCart = () => {
    setCart(0);
  }

  const closeProduct = () => {
    removeOverlay();
  }

  const { data: categoriesData, isLoading: categoriesIsLoading, error: categoriesError } = useQuery({
    queryKey: ["fetchCategories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    const permalink = window.location.pathname.replace("/", "");
    const category = categoriesData ? categoriesData.find((c) => c.permalink === permalink) : null;
    
    if (category) {
      setActiveCategory(category);
    }
  }, [categoriesData]);

  const permalink = activeCategory ? activeCategory.permalink : 'featured';

  const { data: productsData, isLoading: productsIsLoading, error: productsError } = useQuery({
    queryKey: ["fetchProducts", permalink],
    queryFn: () => fetchProducts(permalink),
  });


  if (categoriesIsLoading) return "Loading...";
  if (categoriesError) return "Oops an error happened: " + categoriesError.message;
  if (productsError) return "Oops an error happened loading products: " + productsError.message;

  
  return (
    <div className="catalog">
      <CartInidicator cart={cart} clearCart={clearCart} />
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

const Category = ({ category, activeCategory, onClickCategory }) => {
  const currentCategoryPermalink = activeCategory ? activeCategory.permalink : '';

  return (
    <li
      id={"category_" + category.id}
      className="category"
      name={category.name}
      permalink={category.permalink}
    >
      <a
        className={currentCategoryPermalink === category.permalink ? 'active' : ''}
        onClick={() => onClickCategory(category)}
      >
        {category.name}
      </a>
    </li>
  );
};

const Products = ({ products, activeCategory, onClickProduct }) => {
  return (
    <>
      <h2>{(activeCategory && activeCategory.name) || 'Featured Products'}</h2>
      <ul className="products">
        {products.map((product) => (
          <Product key={product.id} product={product} onClickProduct={onClickProduct} />
        ))}
      </ul>
    </>
  );
};

const Product = ({ product, onClickProduct }) => {
  return (
    <li 
      key={"product_" + product.id} 
      onClick={() => onClickProduct(product)}
    >
      <h3 className="productName">{product.name}</h3>
      <div className="productPhoto">
        <img src={product.main_photo} />
      </div>
      <p className="productPrice">{currencyFormat(product.price)}</p>
      <p className="productDescription">
        {ReactHtmlParser(product.short_description)}
      </p>
    </li>
  );
};

const ProductDetails = ({ product, addToCart, closeProduct }) => {
  const [visible, setVisible] = useState(true);
  const [show, setShow] = useState(true);
  const [buyButton, setBuyButton] = useState('Add to Cart');
  
  const clickClose = () => {
    setShow(false);
    closeProduct();
  }

  const clickAddToCart = () => {
    console.log("====> add to cart");
    setBuyButton('Added!');
    addToCart({product});
    handleFadeOut();
  }

  const handleFadeOut = () => {
    setVisible(false);
    setTimeout(() => {
      setShow(false);  
      closeProduct();
    }, 1500);
  }

  return (
    <>
      {show && (
        <div className={`productDetails ${ visible ? 'visible' : 'fading'}  `}>
          <i className="close-button fa-solid fa-xmark" onClick={clickClose} ></i>
          <div className="container">
            <div className="productPhoto">
              <img src={product.main_photo} />
            </div>
            <div className="productDescription">
              <div className="gutter">
                <h1>{product.name}</h1>
                <h4>{product.short_description}</h4>
                <p>{ReactHtmlParser(product.short_description)}</p>
                
                <p className="productPrice">{currencyFormat(product.price)}</p>

                <button className="buy button" onClick={clickAddToCart}>{buyButton}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

};

const CartInidicator = ({cart, clearCart}) => {
  
  return (
    <div className="cartIndicator" onClick={clearCart}>
      <i className="fa-solid fa-shopping-cart"></i> {cart} items in cart
    </div>
  );
};

const currencyFormat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default Catalog;