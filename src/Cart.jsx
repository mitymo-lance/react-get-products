import { useEffect, useRef, useState } from "react";
import usePersistState from "./usePersistState.js";
import currencyFormat from "./currency_format.js";
import "./Cart.scss";

export default ({cart, setCart, clearCart, removeFromCart}) => {
  const [show, setShow] = usePersistState("show", false);
  const elementRef = useRef(null);
  const  [fixed, setFixed] = useState(false);

  const CartInidicator = ({cart, showCart}) => {
    return (
      <div className="cartIndicator" onClick={showCart}>
        <i className="fa-solid fa-shopping-cart"></i> {cart.length} items in cart
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  };

  const showCart = () => {
    console.log(']]]]]]]]]> show cart cliecked');
    if( show === true ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }

  /* ----------------------
    
  This was for sticking the cart to the top of the page but decided not to use it

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setFixed(!e.isIntersecting),
      { threshold: 0.5 }
    );
    
    if (elementRef.current) observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);
  ---------------------- */

  if (!cart) return null;
  console.dir(cart);
  const total = cart.reduce((acc, item) => acc + parseFloat(item.product.price * item.quantity), 0);
  
  return (
    <div ref={elementRef} className={(show ? 'cart show' : 'cart') + (fixed ? ' fixed' : '')}>
      <CartInidicator cart={cart} showCart={showCart} />
      <div className="contents" >
        <h4 onClick={clearCart}>Cart</h4>
        <i className="close-button fa-solid fa-chevron-down"  onClick={showCart}></i>
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
      { cart.length > 0 && (
        <button className="checkout">Checkout</button>
      )}

    </div>
  );
}




