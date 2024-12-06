import Login from "./Login.jsx";
import "./Header.scss";


export default () => {
  return (
    <header className="header" >
      <div>
        <div>
          <a href="https://tangiblelabs.com" target="_blank">
            <img src="/tangiblelabs-logo-hashtag-circle.svg" className="logo tangible" atl="Tangible Labs logo" />
          </a>
        </div>
        <h1>Get Products</h1>
        <Login/>
      </div>
    </header>
  )
}
    