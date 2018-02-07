import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import Header from './header/Header'
import Home from './pages/home/Home';
import Objects from './pages/objects/Objects';
import Templates from './pages/templates/Templates';
import Assets from './pages/assets/Assets';
import About from './pages/about/About';

class Router extends Component {
    render() {
        return (<BrowserRouter basename={'diplo'}>
          <div className="Page">
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/objects" component={Objects} />
            <Route path="/templates" component={Templates} />
            <Route path="/assets" component={Assets} />
            <Route path="/about" component={About} />
          </div>
        </BrowserRouter>);
    }
}

export default Router;
