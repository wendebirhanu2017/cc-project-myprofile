import React, { Component } from "react";
import { Fade, Slide } from "react-reveal";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactName: "",
      contactEmail: "",
      contactSubject: "",
      contactMessage: "",
      successMessage: "",
      // Add state properties for validation
      nameError: "",
      emailError: "",
      messageError: "",
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Function to validate email using a simple regex pattern
  validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { contactName, contactEmail, contactSubject, contactMessage } = this.state;
    // Reset previous error messages
    this.setState({
      nameError: "",
      emailError: "",
      messageError: "",
    });

    // Validate form fields
    let isValid = true;

    if (contactName.trim() === "") {
      this.setState({ nameError: "Name is required" });
      isValid = false;
    }

    if (!this.validateEmail(contactEmail)) {
      this.setState({ emailError: "Valid email is required" });
      isValid = false;
    }

    if (contactMessage.trim() === "") {
      this.setState({ messageError: "Message is required" });
      isValid = false;
    }

    if (!isValid) {
      // If any validation fails, prevent form submission
      return;
    }

    // If all validations pass, proceed to submit the form
    const requestBody = {
      senderName: contactName,
      senderEmail: contactEmail,
      subject: contactSubject,
      messageBody: contactMessage,
    };

    fetch('https://nyue0df8r4.execute-api.us-east-1.amazonaws.com/prod/contact', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            contactName: "",
            contactEmail: "",
            contactSubject: "",
            contactMessage: "",
            successMessage: 'Message sent successfully.',
          });
          
        } else {
          this.setState({ successMessage: 'Message could not be sent. Please try again.' });
        }
      })
      .catch((error) => {
        console.error('An error occurred while submitting the form:', error);
        this.setState({ successMessage: 'An error occurred. Please try again later.' });
      });
  };

  render() {
    if (!this.props.data) return null;

    const name = this.props.data.name;
    const street = this.props.data.address.street;
    const city = this.props.data.address.city;
    const state = this.props.data.address.state;
    const zip = this.props.data.address.zip;
    const phone = this.props.data.phone;
    const message = this.props.data.contactmessage;

    return (
      <section id="contact">
        <Fade bottom duration={1000}>
          <div className="row section-head">
            <div className="two columns header-col">
              <h1>
                <span>Get In Touch.</span>
              </h1>
            </div>

            <div className="ten columns">
              <p className="lead">{message}</p>
            </div>
          </div>
        </Fade>

        <div className="row">
          <Slide left duration={1000}>
            <div className="eight columns">
              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <div>
                    <label htmlFor="contactName">
                      Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      size="35"
                      id="contactName"
                      name="contactName"
                      value={this.state.contactName}
                      onChange={this.handleChange}
                    />
                    <div className="error-message">{this.state.nameError}</div>
                  </div>

                  <div>
                    <label htmlFor="contactEmail">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      size="35"
                      id="contactEmail"
                      name="contactEmail"
                      value={this.state.contactEmail}
                      onChange={this.handleChange}
                    />
                    <div className="error-message">{this.state.emailError}</div>
                  </div>

                  <div>
                    <label htmlFor="contactSubject">Subject</label>
                    <input
                      type="text"
                      size="35"
                      id="contactSubject"
                      name="contactSubject"
                      value={this.state.contactSubject}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactMessage">
                      Message <span className="required">*</span>
                    </label>
                    <textarea
                      cols="50"
                      rows="15"
                      id="contactMessage"
                      name="contactMessage"
                      value={this.state.contactMessage}
                      onChange={this.handleChange}
                    ></textarea>
                    <div className="error-message">{this.state.messageError}</div>
                  </div>

                  <div>
                    <button className="submit">Send</button>
                    <span id="image-loader">
                      <img alt="" src="images/loader.gif" />
                    </span>
                  </div>
                </fieldset>
              </form>

              <div>
                {this.state.successMessage && <p>{this.state.successMessage}</p>}
              </div>
            </div>
          </Slide>
         <Slide right duration={1000}>
            <aside className="four columns footer-widgets">
              <div className="widget widget_contact">
                <h4>Address and Phone</h4>
                <p className="address">
                  {name}
                  <br />
                  {street} <br />
                  {city}, {state} {zip}
                  <br />
                  <span>{phone}</span>
                </p>
              </div>
            </aside>
          </Slide>
        </div>
      </section>
    );
  }
}

export default Contact;
