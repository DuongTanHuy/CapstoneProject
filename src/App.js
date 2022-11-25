import { AuthProvider } from "contexts/auth-context";
import { Fragment } from "react";
import SubApp from "SubApp";

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <SubApp></SubApp>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
