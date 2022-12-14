import { AuthProvider } from "contexts/auth-context";
import SubApp from "SubApp";
import { MetaProvider } from "contexts/metamask-context";
import { Fragment } from "react";
// import ModalMain from "components/modal/ModalMain";

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <MetaProvider>
          <SubApp></SubApp>
        </MetaProvider>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
