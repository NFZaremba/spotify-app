import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAuth } from "./shared/hooks/spotify";
import AxiosProvider from "./shared/utils/api";
import Routes from "./routes";
import GlobalStyle from "./shared/styles/globalStyles";
import { Login } from "./pages";

// Create a client
const queryClient = new QueryClient();

function App() {
  const accessToken = useAuth(window.location.search);

  useEffect(() => {
    console.log(queryClient.getQueryCache().getAll());
  }, [accessToken]);

  return (
    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <div className="App">
          <header className="App-header">
            {!accessToken ? <Login /> : <Routes />}
          </header>
        </div>
      </QueryClientProvider>
    </AxiosProvider>
  );
}

export default App;
