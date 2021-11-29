import { BrowserRouter, Route } from "react-router-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { allReducers } from "./scripts/redux/reducers/reducers";
import { Layout } from './components/layout/Layout';
import { Landing } from "./components/Landing";
import { Keypair } from "./components/Keypair";
// import { History } from "./components/History";

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Route path="/" exact>
            <Landing />
          </Route>
          <Route path="/keypair">
            <Keypair />
          </Route>
          {/* <Route path="/history">
            <History />
          </Route> */}
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
