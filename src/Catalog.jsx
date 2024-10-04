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
import { categories_url, products_url, catalog_url } from "./config.js";
import usePersistState from "./usePersistState.js";

const fetchCatalog = async () => {
  const { data } = await axios.get(catalog_url);
  return data;
};

const Catalog = () => {
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
    showOverlay();
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

const CartInidicator = ({cart, showCart}) => {
  return (
    <div className="cartIndicator" onClick={showCart}>
      <i className="fa-solid fa-shopping-cart"></i> {cart.length} items in cart
    </div>
  );
};

const Cart = ({cart, setCart, clearCart, removeFromCart}) => {
  const [show, setShow] = usePersistState("show", false);

  const showCart = () => {
    console.log(']]]]]]]]]> show cart cliecked');
    if( show === true ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }

  if (!cart) return null;
  console.dir(cart);
  const total = cart.reduce((acc, item) => acc + parseFloat(item.product.price * item.quantity), 0);
  
  return (
    <div className={show ? 'cart show' : 'cart'}>
      <CartInidicator cart={cart} showCart={showCart} />
      <div className="contents" >
        <h2 onClick={clearCart}>Cart</h2>
        <i className="close-button fa-solid fa-xmark" onClick={showCart} ></i>
        <ul>
          {cart.map((item) => (
            <li key={'cart_' + item.product.id} id={'cart_' + item.product.id}>
              <span className="quantity">{item.quantity}</span>
              <span className="name">{item.product.name}</span>
              <span className="amount">{currencyFormat(item.product.price)}</span>
              <a className="remove" onClick={() => removeFromCart(item.product)}>remove</a>
            </li>
          ))}
          <li className="total">
            <span className="quantity total">&nbsp;</span>
            <span className="name">Total</span>
            <span className="amount total">{currencyFormat(total)}</span>
            <a className="remove">&nbsp;</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

const currencyFormat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default Catalog;