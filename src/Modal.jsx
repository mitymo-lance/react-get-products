import { useState, useEffect } from "react";
import './Modal.scss';

export default ({ size, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  const [show, setShow] = useState(true);
  
  return (
    <>
      <div className="overlay Im-new" onClick={onClose}>
        <div className={`modal ${size} `} onClick={(e) => e.stopPropagation()}>
          <i className="close-button fa-solid fa-xmark" onClick={onClose} ></i>
          { children }
        </div>
      </div>
    </>
  )
}