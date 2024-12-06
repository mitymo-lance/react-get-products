import { useState, useEffect } from "react";
import './_modal.scss';

export default (props) => {
  const [show, setShow] = useState(true);
  
  const clickClose = () => {
    setShow(false);
    removeOverlay();
    props.clickClose();
    
  }

  const showOverlay = () => {
    if(document.querySelector(".overlay")) return;
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
      setShow(false);
      props.clickClose();
      overlay.remove();
    }
  };

  useEffect(() => {
    if (show) {
      showOverlay();
    } else {
      removeOverlay();
    }
  }, [show]);

  return (
    <>
      {show && (
        <div className={`modal ${props.size} `}>
          <i className="close-button fa-solid fa-xmark" onClick={clickClose} ></i>
          {props.children}
        </div>
      )}
      
    </>
  )
}