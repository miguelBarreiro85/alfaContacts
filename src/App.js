import React from 'react';
import { Route, Switch } from 'react-router';
import Contacts from './components/Contacts/Contacts';
import NewContact from './components/NewContact/NewContact';
import  {NavLink} from 'react-router-dom';

function App() {


  return (
    <div className="App">
      <li>
        <NavLink
          exact to="/"
          activeStyle={{
            fontWeight: "bold",
            color: "red"
          }}>Contacts</NavLink>
        <NavLink
          exact to="/newcontact"
          activeStyle={{
            fontWeight: "bold",
            color: "red"
          }}>New Contact</NavLink>
      </li>
      <Switch>
        <Route path="/" exact component={Contacts} />
        <Route path="/newcontact" exact component={NewContact} />
      </Switch>

    </div>
  );
}

export default App;
