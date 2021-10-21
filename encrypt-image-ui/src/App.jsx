import { BrowserRouter, Route } from "react-router-dom";
import { Layout } from './components/layout/Layout';
import { Landing } from "./components/Landing";
import { Keypair } from "./components/Keypair";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/keypair">
          <Keypair />
        </Route>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
