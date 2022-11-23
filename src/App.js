import { AuthProvider } from "contexts/auth-context";
import SubApp from "SubApp";

function App() {
  return (
    <div>
      <AuthProvider>
        <SubApp></SubApp>
      </AuthProvider>
    </div>
  );
}

export default App;
