import { React, useState, useEffect } from 'react';
import axios from "axios";
import { signin_url } from "./config.js";
import { useModal } from './ModalContext';
import usePersistState from "./usePersistState.js";
import "./Login.scss";


export default () => {
  const [loginStatus, setLoginStatus] =  usePersistState("loginState", false);
  const [show, setShow] = useState(false);
  const { showModal, hideModal } = useModal();

  const showLogin = () => {
    setShow(true);
    console.log('show login');
    showModal('small',
      <>
        <h4>Login</h4>
        <form onSubmit={doLogin}>
          <input type="text" name="email" placeholder="Email address" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </>
    );
  }

  const doLogin = (event) => {
    event.preventDefault();
    console.log('in doLogin - ' + signin_url);

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const customer = {email, password}
    axios.post(signin_url, {
      customer: customer
    }).then((response) => {
      console.log('response: ' + JSON.stringify(response));
      setLoginStatus(true);
      hideModal();
    }).catch((error) => {
      console.log('error: ' + error);
      setLoginStatus(false);
    });
  }
  
  const doLogout = (event) => {
    event.preventDefault();
    console.log('>>>> clicked doLogout - loginStatus: ' + loginStatus);
    setLoginStatus(false);
  }

  return (
    <>
      {!loginStatus ? (
        <div className="login">
          <button className="apple-button" onClick={showLogin}>Login</button>
        </div>
      ) : (
        <div className="login">
          <a classsName="button apple-button" onClick={doLogout}>Logout { loginStatus }</a>
        </div>
      )}
    </>
  )
}