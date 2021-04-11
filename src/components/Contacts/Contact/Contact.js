import React from 'react'
import axios from "../../../axios-contacts";
import { Link } from "react-router-dom";

function Contact(props) {

    function deleteContact() {
        console.log("deleted");
        axios.delete('/contacts/'+props.editLink+'.json');
        props.forceUpdate();
    }
    return (
        <div style={{padding:"10px 10px"}}>
            <p>{props.name}</p>
            <p>{props.email}</p>
            <p>{props.address}</p>
            <p>{props.contact}</p>
            <img src={props.imageUrl} />
            <Link to={{
                pathname:"/newcontact",
                search:"?link="+props.editLink,
                state: { 
                    fromEdit: true, 
                    contactLink:props.editLink,
                    name: props.name,
                    email: props.email,
                    address: props.address,
                    imageUrl: props.imageUrl,
                    contact: props.contact
                }
            }}>Edit</Link>
            <button onClick={deleteContact}>Delet Contact</button>
        </div>

    );
}

export default Contact;