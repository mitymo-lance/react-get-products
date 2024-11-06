import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import './_defaults.scss'
import Catalog from './Catalog.jsx'
import Header from "./Header.jsx";

const queryClient = new QueryClient();

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <Header />
      <Catalog />
    </QueryClientProvider>
  )
}

export default App;