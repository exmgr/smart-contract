import React, { useEffect } from 'react';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { WELCOME_IMG, WELCOME_HEADING, WELCOME_TEXT } from '../../data/Data'
import { useParams } from 'react-router';

const Welcome = () => {
  let { ref } = useParams();

  const onClickHandlerProducts = () => {
    var elmnt = document.getElementById('products');
    document.getElementById('products');
    elmnt.scrollIntoView()
  }

  const onClickHandlerContact = () => {
    var elmnt = document.getElementById('contact');
    document.getElementById('contact');
    elmnt.scrollIntoView()
  }

  useEffect(() => {
      switch (ref) {
        case "contact":
          onClickHandlerContact();
          break;
        case "products":
          onClickHandlerProducts();
          break;
        case "statistics":
          var elmnt = document.getElementById('statistics');
          document.getElementById('statistics');
          elmnt.scrollIntoView()
          break;
        default:
          var elmnt = document.getElementById('start');
          document.getElementById('start');
          elmnt.scrollIntoView()
          break;
      }
  })

  return (
    <>
      <Container fluid id='start'>
        <Row className="justify-content-md-center hero-dark welcome-bg hero-container">
          <Container className='hero-container mt-50'>
            <Row className='heading pd-20 mt-50 text-shadow'>
              {WELCOME_HEADING}
            </Row>
            <Row xs={1} lg={1} className="justify-content-md-center">
              <Col>
                <Container className='pd-10'>
                  <Row className='large-text'>
                    {WELCOME_TEXT}
                  </Row>
                  <Row className='mt-25'>
                    <Button className='dark' onClick={onClickHandlerProducts}>
                      Risk Coverage Options
                    </Button>
                    {/*<Button className='dark ml-30' onClick={onClickHandlerContact}>
                      Contact Us
                  </Button>*/}
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}

export default Welcome;
