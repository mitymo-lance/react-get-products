import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import './_defaults.scss'
import { ModalProvider } from './ModalContext';

import Catalog from './Catalog.jsx'
import Header from "./Header.jsx";
import Login from "./Login.jsx";

const queryClient = new QueryClient();

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
        <ModalProvider>
          <Header>
            <Login />
          </Header>
          <Catalog />
        </ModalProvider>
    </QueryClientProvider>
  )
}

export default App;