import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import Header from './header/Header'
import Home from './pages/home/Home'
import AddObjectToType from './pages/objects/AddObjectToType'
import CreateObjectType from './pages/objects/CreateObjectType'
import Objects from './pages/objects/Objects'
import Templates from './pages/templates/Templates'
import Assets from './pages/assets/Assets'
import About from './pages/about/About'

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

    setInterval(() => model.update(), 15000)
  }

  render() {
    const model = this.model

    function renderPage(Class) {
      return (props) => {
        return <Class model={model} match={props.match} />
      }
    }

    return (<BrowserRouter basename={'diplo'}>
      <div className="Page">
        <Header />
        <Route path="/" exact render={renderPage(Home, this)} />
        <Route path="/objects" exact render={renderPage(Objects, this)} />
        <Route path="/objects/create" render={renderPage(CreateObjectType, this)} />
        <Route path="/objects/:object/add" render={renderPage(AddObjectToType, this)} />
        <Route path="/templates" render={renderPage(Templates, this)} />
        <Route path="/assets" render={renderPage(Assets, this)} />
        <Route path="/about" render={renderPage(About, this)} />
      </div>
    </BrowserRouter>);
  }
}

export default Router;
