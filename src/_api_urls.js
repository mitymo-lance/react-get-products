export const api_urls = [
  {
    environment: "production",
    name: "categories",
    url: "https://www.tangiblelabs.com/categories.json",
  }, 
  {
    environment: "production",
    name: "products",
    url: "https://www.tangiblelabs.com/products.json?category=",
  },
  {
    environment: "production",
    name: "catalog",
    url: "https://www.tangiblelabs.com/catalog.json",
  },
  {
    environment: "production",
    name: "signin",
    url: "https://www.tangiblelabs.com/signin.",
  },
  {
    environment: "development",
    name: "categories",
    url: "http://localhost:5115/categories.json",
  }, 
  {
    environment: "development",
    name: "products",
    url: "http://localhost:5115/products.json?category=",
  },
  {
    environment: "development",
    name: "catalog",
    url: "http://localhost:5115/catalog.json",
  },
  {
    environment: "development",
    name: "signin",
    url: "http://localhost:5115/api/v1/customers/sign_in.json",
  }
]
