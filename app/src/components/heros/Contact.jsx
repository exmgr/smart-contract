import React from 'react';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import FormLabel from 'react-bootstrap/FormLabel'
import { CONTACT_FORM } from '../../data/Data'

const Contact = () => {
  return (
    <Container fluid id='contact'>
      <Row className="justify-content-md-center hero-light hero-container">
        <Container className='hero-container'>
          <Row className='standard-text pd-20 mt-50'>
            {CONTACT_FORM.text}
          </Row>

          <Row xs={1} lg={2} className="justify-content-md-center">
            <Col>
              <Image src={CONTACT_FORM.img} fluid rounded />
            </Col>
            <Col>
              <Container>
                <Row className='heading'>
                  {CONTACT_FORM.heading}
                </Row>
                <Row className='pd-20'>
                  <FormLabel>Your Name:</FormLabel>
                  <FormControl
                    placeholder="First- and last name"
                    aria-label="name"
                    aria-describedby="basic-addon1"
                  />

                  <FormLabel className='mt-25'>Your E-Mail:</FormLabel>
                  <FormControl
                    placeholder="yourname@example.com"
                    aria-label="mail"
                    aria-describedby="basic-addon1"
                  />
                  <FormLabel className='mt-25'>Your Message:</FormLabel>
                  <FormControl as="textarea" aria-label="With textarea" className='textfield'/>
                </Row>
                <Row className='pd-10 centering'>
                <Button className='connect-button primary'>Send</Button>
                </Row>
              </Container>
            </Col>
          </Row>

        </Container>
      </Row>
    </Container>
  );
}

export default Contact;