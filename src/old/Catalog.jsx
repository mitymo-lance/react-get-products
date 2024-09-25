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

const queryClient = new QueryClient();

//const categories_url = 'http://localhost:3000/categories.json';
const categories_url = "https://www.tangiblelabs.com/categories.json";
//const products_url = 'http://localhost:3000/products.json?category=';
const products_url = "https://www.tangiblelabs.com/products.json?category=";

const Catalog = () => {
  const currentPermalink = getCurrentHref();
  const [categoryPermalink, setCategoryPermalink] = useState(getCurrentCategoryPermalink());
  const [products, setProducts] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [categories, setCategories] = useState([]);

  const handleClickCategory = (event, category) => {
    event.stopPropagation();
    setCategory(category);
    const permalink = '/categories/' + category.permalink;

    window.history.pushState(
      { id: permalink },
      category.name,
      permalink,
    );

    document.querySelectorAll(".category a").forEach((item) => {
      item.classList.remove("active");
    });

    return
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CartInidicator />
        <ul className="categories">
          {categories.map(category => (
            <Category category={category}  />

          ))}
        </ul>
        
      </QueryClientProvider>
    </>
  );
};

const Category = ({category}) => {
  return (
    <li 
      key={"category_" + category.id} 
      id={"category_" + category.id}
      permalink={category.permalink}
      name="{category.name}"
      className="category">
      <a className={category.permalink == category.permalink ? "active" : ""}
        onClick={(event) => handleClickCategory(event, category)}>{category.name}</a>
    </li>

  )
}

const Categories = ({ category, categories, setCategories, handleClickCategory }) => {
  
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

  function clickCategory(event, category) {
    event.stopPropagation();
    setCategory(category);
    const permalink = '/categories/' + category.permalink;

    window.history.pushState(
      { id: permalink },
      category.name,
      permalink,
    );

    document.querySelectorAll(".category a").forEach((item) => {
      item.classList.remove("active");
    });

    return false;
  }

  
  return (
    <>
      <ul key="categoriesList" className="categories">
        {categories.map((cat) => (
          <li 
            key={"category_" + cat.id}
            id={"category_" + cat.id}
            className="category"
            permalink={cat.permalink}
            name={cat.name}
          >
            <a className={cat.permalink == category.permalink ? "active" : ""}
        onClick={(event) => handleClickCategory(event, cat)}>{cat.name}</a>
          </li>
        ))}

      </ul>
    </>
  )
}

const Products = ({ category, categories, setCategory }) => {
  const [products, setProducts] = useState([]);
  const permalink = category.permalink || getCurrentCategoryPermalink();
  
  if (permalink == "" ) {
    return (
      <>
        <p>Choose a category</p>
      </>
    )
  } else {
    const clickDetails = (p) => {
      showOverlay();
      setProduct(p);
    };

    if( typeof category == 'undefined' || category == '' ) {
      console.log('====> category is undefined');
      setCategory( categories.find((c) => c.permalink == permalink) )
      console.log('====> category.name: ' + category.name);
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
        setProduct('');
        window.history.back();
        overlay.remove();
      }
    };

    const { error, data, isLoading } = useQuery({
      queryKey: ["categoryPermalink", permalink],
      queryFn: () => fetchProducts(permalink),
    });

    useEffect(() => {
      if (data) setProducts(data);
    }, [data]);

    if (isLoading) return "Loading...";
    if (error) return "Oops an error happened: " + error.message;
  
    return (
      <>
        <h2>{category.name}</h2>

        <ul className="products">
          {products.map((p) => (
            <li 
              key={"product_" + p.id} 
              onClick={() => clickDetails(p)}
            >
              <h3 className="productName">{p.name}</h3>
              <div className="productPhoto">
                <img src={p.main_photo} />
              </div>
              <p className="productPrice">{currencyFormat(p.price)}</p>
              <p className="productDescription">
                {ReactHtmlParser(p.short_description)}
              </p>
            </li>
          ) )}
        </ul>
      </>
    )
  }
}

const ProductDetails = ({ product, setProduct}) => {
  const permalink = '/products/' + product.permalink;
  const [buyButton, setBuyButton] = useState('Add to Cart');
  
  window.history.pushState(
    { id: permalink },
    product.name,
    permalink,
  );

  const clickClose = () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      setProduct('');
      window.history.back();
      overlay.remove();
    }
  }

  const clickAddToCart = () => {
    console.log("====> add to cart");
    setBuyButton('Added!');
  }

  return (
    <div className="productDetails">
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
  )
}

const CartInidicator = () => {
  return (
    <div className="cartIndicator">
      <i className="fa-solid fa-shopping-cart"></i>
      </div>
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

const getCurrentHref = () => {
  if (window.location.pathname == "/") {
    return "";
  } else {
    return window.location.pathname
      .substring(1, window.location.pathname.length)
  }
};

const getCurrentCategoryPermalink = () => {
  const currentHref = getCurrentHref();
  if (currentHref == '/') {
    return '';
  } else {
    if( currentHref.split('/')[0] == 'categories' ) {
      return currentHref.split('/')[1];
    } else {
      return '';
    }
  }
}


const currencyFormat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default Catalog;


