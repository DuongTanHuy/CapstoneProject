import { AuthProvider } from "contexts/auth-context";
import SubApp from "SubApp";
import { MetaProvider } from "contexts/metamask-context";
import { Fragment } from "react";
import MainCreateBlock from "components/user/MainCreateBlock copy";
import CreateAuction from "components/user/CreateAuction";

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <MetaProvider>
          <MainCreateBlock></MainCreateBlock>
          <CreateAuction></CreateAuction>
          {/* <SubApp></SubApp> */}
        </MetaProvider>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
