import { QueryClient, QueryClientProvider } from "react-query";
import { useAuth } from "./shared/hooks/spotify";
import AxiosProvider from "./shared/utils/api";
import Routes from "./routes";
import StyledLoginButton from "./shared/components/Button";
import GlobalStyle from "./shared/styles/globalStyles";

// Create a client
const queryClient = new QueryClient();

function App() {
  const accessToken = useAuth(window.location.search);
  console.log(queryClient.getQueryCache().getAll());
  return (
    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <div className="App">
          <header className="App-header">
            {!accessToken ? (
              <StyledLoginButton
                className="login-btn"
                href="http://localhost:8888/login"
              >
                Log in to Spotify
              </StyledLoginButton>
            ) : (
              <Routes />
            )}
          </header>
        </div>
      </QueryClientProvider>
    </AxiosProvider>
  );
}

export default App;
