import './App.css';
import React from 'react';
import { Provider } from 'react-redux'
import generateStore from "./redux/store"

import ConfigRouter from "./routes/configRouter";
import { BrowserRouter as Router } from "react-router-dom";

import NavbarComponent from "./components/static/navbar";
import * as constants from "./helpers/constants";


function App() {
  const store = generateStore();

  return (
    <Provider store={store}>
      <Router basename={constants.URL_BASE_NAME}>
        <header>
          <NavbarComponent />
        </header>
        <ConfigRouter />
      </Router>
    </Provider>
  );
}

export default App;
