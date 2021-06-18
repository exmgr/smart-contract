import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Header from './components/root/Header';
import Store from './utils/Store';
import Farmer from './pages/Farmer';
import Footer from './components/root/Footer';
import "./styles/App.css"
import Home from './pages/Home';
import User from './components/farmer/User';
import Send from './components/farmer/Send';
import Admin from './pages/Admin';

const App = () => {

  return (
    <div className="App">
      <Store>
        <Router>
          <Header />
          <Switch>

          <Route exact path='/'>
              <Home />
            </Route>

            <Route exact path='/products/:product'>
              <Farmer />
            </Route>

            <Route exact path='/user'>
              <User />
            </Route>

            <Route exact path='/send'>
              <Send />
            </Route>

            <Route exact path='/admin'>
              <Admin />
            </Route>

            <Route path='/:ref'>
            <Home />
          </Route>

          </Switch>
          <Footer />
        </Router>
      </Store>
    </div>
  );
}

export default App;
