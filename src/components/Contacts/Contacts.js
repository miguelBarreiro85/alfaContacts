import React, { Component} from 'react';
import { NavLink } from 'react-router-dom';
import axios from '../../axios-contacts';
import Contact from './Contact/Contact';

class Contacts extends Component {
    updatedContacts = [];
    state = {
        contacts:[]
    };

    componentDidMount(){
        this.getContacts();
    }
    
    getContacts = () => {
        axios.get('contacts.json')
        .then(res => {
            for (let key in res.data) {
                let updatedContact = {...res.data[key]};
                updatedContact.id = key;
                this.updatedContacts.push(updatedContact);
            }
            this.setState({contacts:this.updatedContacts});
        })
        .catch(err => {
            console.log (err);
        });
    }

    forceUpdate = () => {
        this.setState({contacts:[]})
    }

    render(){
        return(
            <div>
                {this.state.contacts.map(contact => (
                    <Contact 
                        key={contact.id}
                        name={contact.name}
                        contact={contact.contact}
                        email={contact.email}
                        address={contact.address}
                        imageUrl={contact.downloadPhotoURL}
                        editLink={contact.id}
                        forceUpdate={this.forceUpdate} />
                ))}
            </div>
            
            //Lista de contactos
        );
    }
}

export default Contacts;