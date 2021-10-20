import { BrowserRouter, Route } from "react-router-dom";
import { Layout } from './components/layout/Layout';
import { Landing } from "./components/Landing";

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Route path="/">
          <Landing />
        </Route>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
