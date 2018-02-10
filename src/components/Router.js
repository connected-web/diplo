import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import Header from './header/Header'
import Home from './pages/home/Home';
import Objects from './pages/objects/Objects';
import Templates from './pages/templates/Templates';
import Assets from './pages/assets/Assets';
import About from './pages/about/About';

import GlobalModel from './models/Global'

class Router extends Component {
  constructor() {
    super()
    this.model = new GlobalModel()
    this.attachModel(this.model)
  }

  attachModel(model) {
    model.listen((data) => {
      console.log('Model updated', data)
      this.setState(data)
      this.render()
    })
    model.update()

    setInterval(() => model.update(), 5000)
  }

  render() {
    const model = this.model

    function renderPage(Class) {
      return () => {
        return <Class model={model} />
      }
    }

    return (<BrowserRouter basename={'diplo'}>
      <div className="Page">
        <Header />
        <Route path="/" exact render={renderPage(Home)} />
        <Route path="/objects" render={renderPage(Objects)} />
        <Route path="/templates" render={renderPage(Templates)} />
        <Route path="/assets" render={renderPage(Assets)} />
        <Route path="/about" render={renderPage(About)} />
      </div>
    </BrowserRouter>);
  }
}

export default Router;
