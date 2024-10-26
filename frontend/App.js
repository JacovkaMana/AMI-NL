import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatRoom from './components/ChatRoom';
import CharacterCreation from './components/CharacterCreation';
import LandingPage from './components/LandingPage';

function App() {
    return (
        <Router>
            <Header />
            <main>
                <Switch>
                    <Route path="/" exact component={LandingPage} />
                    <Route path="/character-creation" component={CharacterCreation} />
                    <Route path="/chat-room" component={ChatRoom} />
                </Switch>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
