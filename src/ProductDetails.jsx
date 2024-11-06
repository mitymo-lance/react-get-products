import { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import Cart from "./Cart.jsx";
import currencyFormat from "./currency_format";

export default ({ product, addToCart, closeProduct }) => {
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