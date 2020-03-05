import React from 'react';
import 'papercss/dist/paper.min.css'
import './App.css';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './routes/Home';
import Listing from './routes/Listing';
import { ApiProvider } from './api';

function App() {
    return (
        <div className="App">
            <ApiProvider>
                <h1>Ecme Bookings</h1>
                <Router>
                    <Switch>
                        <Route path="/listing/:id" component={Listing} />
                        <Route path="/:page" component={Home} />
                        <Redirect to="/0" />
                    </Switch>
                </Router>
            </ApiProvider>
        </div>
    );
}

export default App;
