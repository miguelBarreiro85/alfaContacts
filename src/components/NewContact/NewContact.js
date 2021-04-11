import React, { Component } from 'react';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import axios from '../../axios-contacts';
import firebase from "../../firebase";

class NewContact extends Component {
    state = {
        contactForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                },
                valid: false,
                touched: false
            },
            address: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            contact: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Contact'
                },
                value: '',
                validation: {
                    required: true,
                    maxLength: 9,
                    minLength: 9,
                    onlyNumbers: true
                },
                valid: false,
                touched: false
            },
        },
        image: null,
        progress: 0,
        downloadURL: null,
        formIsValid: false,
        loading: false,
        fromEdit: false,
        contactLink: ''
    };

    updateStateFromEdit(updatedContactForm, key) {
        //vai clonar os objectos dentros da keys
        let updatedForm = {
            ...updatedContactForm[key]
        };
        updatedForm.value = this.props.location.state[key];
        updatedForm.valid = this.checkValidity(updatedForm.value, updatedForm.validation)
        updatedForm.touched = true;
        updatedContactForm[key] = updatedForm;
        return updatedContactForm;
    }
    componentDidMount() {
        if (this.props.location.state) {

            let updatedContactForm = {
                ...this.state.contactForm
            };
            updatedContactForm = this.updateStateFromEdit(updatedContactForm, "name");
            updatedContactForm = this.updateStateFromEdit(updatedContactForm, "address");
            updatedContactForm = this.updateStateFromEdit(updatedContactForm, "email");

            let imageUrl = this.props.location.state.imageUrl;
            
            this.setState({ contactForm: updatedContactForm, downloadURL: imageUrl });
        }
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.onlyNumbers) {
            isValid = !isNaN(value) && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //apenas vai clonar as keys 
        const updatedContactForm = {
            ...this.state.contactForm
        };
        //vai clonar os objectos dentros da keys
        const updatedFormElement = {
            ...updatedContactForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true;
        updatedContactForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedContactForm) {
            formIsValid = updatedContactForm[inputIdentifier].valid && formIsValid && this.state.downloadURL != null;
        }
        this.setState({ contactForm: updatedContactForm, formIsValid: formIsValid });
    }

    addContactHandler = (event) => {
        event.preventDefault();
        // alert('You continue!');
        this.setState({ loading: true });
        const formData = {};
        for (let formElementIdentifier in this.state.contactForm) {
            formData[formElementIdentifier] = this.state.contactForm[formElementIdentifier].value;
        }
        formData.downloadPhotoURL = this.state.downloadURL;

        if (this.props.location.state) {
            axios.patch('/contacts/' + this.props.location.state.contactLink+'.json', formData)
                .then(response => {
                    this.setState({ loading: false });
                    this.props.history.push('/');
                })
                .catch(error => {
                    this.setState({ loading: false });
                });
        } else {
            axios.post('/contacts.json', formData)
                .then(response => {
                    this.setState({ loading: false });
                    this.props.history.push('/');
                })
                .catch(error => {
                    this.setState({ loading: false });
                });
        }

    }

    handleChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                image: e.target.files[0]
            })
        }
        let formIsValid = this.state.formIsValid && this.state.downloadURL != null;
        if (formIsValid) {
            this.setState({formIsValid: true})
        }
        
        // console.log(e.target.files[0])
    }

    handleUpload = () => {
        // console.log(this.state.image);
        let file = this.state.image;
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var uploadTask = storageRef.child('folder/' + file.name).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
                this.setState({ progress })
            }, (error) => {
                throw error
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    this.setState({
                        downloadURL: url
                    })
                })
                //document.getElementById("file").value = null
            }
        )
    }

    render() {
        const formElementArray = [];
        for (let key in this.state.contactForm) {
            formElementArray.push({
                id: key,
                config: this.state.contactForm[key]
            })
        }
        let form = (
            <form onSubmit={this.addContactHandler}>
                {formElementArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Add new Contact</Button>
            </form>

        );
        
        return (
            <div>
                {form}
                <h4>upload your photo</h4>
                <label>
                    Choose file
                    <input type="file" id="file" onChange={this.handleChange} />
                </label>
                {this.state.progress}
                <button className="button" onClick={this.handleUpload}>Upload</button>
                <img
                    className="ref"
                    src={this.state.downloadURL  || "https://via.placeholder.com/400x300"}
                    alt="Uploaded Images"
                    height="300"
                    width="400"
                />
            </div>
            //Lista de contactos
        );
    }

}

export default NewContact;