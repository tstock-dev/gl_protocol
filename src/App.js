import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Home from "./pages/home";
import MyTopics from "./pages/my_topics";
import AllTopics from "./pages/all_topics";
import CreateAgenda from "./pages/create_agenda";
import CreateProtocol from "./pages/create_protocol";
import SearchProtocol from "./pages/search_protocol";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <div className="App-container container">
            <div className="site-branding">
              <Link to="/">
                <img src="/logo_dachmarke-bbw.svg" alt="logo" />
              </Link>
            </div>

            <div className="header-right">
              <div className="meta-nav">
                <div className="header-placeholder"></div>
                <nav id="site-navigation">
                  <div className="row">
                    <div className="col">
                      <div className="menu-container">
                        <ul className="menu">
                          <li className="menu-item">
                            <Link to="/myTopics">Meine<br/>Agenda-Punkte</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col">
                      <div className="menu-container">
                        <ul className="menu">
                          <li className="menu-item">
                            <Link to="/allTopics">Alle<br/>Agenda-Punkte</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col">
                      <div className="menu-container">
                        <ul className="menu">
                          <li className="menu-item">
                            <Link to="/createAgenda">Agenda<br/>erstellen</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col">
                      <div className="menu-container">
                        <ul className="menu">
                          <li className="menu-item">
                            <Link to="/createProtocol">Protokoll<br/>erstellen</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col">
                      <div className="menu-container">
                        <ul className="menu">
                          <li className="menu-item">
                            <Link to="/searchProtocol">Protokoll-<br/>Historie</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <div id="content" className="site-content rot">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/myTopics">
              <MyTopics />
            </Route>
            <Route path="/allTopics">
              <AllTopics />
            </Route>
            <Route path="/createAgenda">
              <CreateAgenda />
            </Route>
            <Route path="/createProtocol">
              <CreateProtocol />
            </Route>
            <Route path="/searchProtocol">
              <SearchProtocol />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
