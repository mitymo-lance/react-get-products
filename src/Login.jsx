import { React, useState, useEffect } from 'react';
import axios from "axios";
import { signin_url } from "./config.js";
import Modal from "./Modal.jsx";
import usePersistState from "./usePersistState.js";
import "./Login.scss";

const handleLogin = async () => {
  console.log('in handleLogin: ' + signin_url);
  const { data } = await axios.get(signin_url);
  return data;
};

export default () => {
  const [loginStatus, setLoginStatus] =  usePersistState("loginState", false);
  const [show, setShow] = useState(false);

  const showLogin = () => {
    setShow(true);
    console.log('show login');
  }

  const clickClose = () => {
    setShow(false);
    console.log('close login');
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
      setShow(false);
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
          {show ?  (
            <Modal size="small" clickClose={clickClose}>
              <h4>Login</h4>
              <form onSubmit={doLogin}>
                <input type="text" name="email" placeholder="Email address" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
              </form>
            </Modal>
          ) : (
            <button onClick={showLogin}>Login</button>
          )}
        </div>
      ) : (
        <div className="login">
          <button onClick={doLogout}>Logout { loginStatus }</button>
        </div>
      )}
    </>
  )
}