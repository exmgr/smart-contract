import React from 'react';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { BiCloudLightRain } from 'react-icons/bi'
import { IoMdSnow } from 'react-icons/io'
import { RiWindyLine } from 'react-icons/ri'
import { BiSun } from 'react-icons/bi'
import { IconContext } from 'react-icons/lib';
import { VscError } from 'react-icons/vsc'
import { PRODUCT_CARDS_CONTENT, PRODUCTS } from '../../data/Data'
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';

const ProductTable = () => {

  const getIcon = (icon) => {
    switch(icon) {
      case 'rain':
        return(<BiCloudLightRain />)
      case 'wind':
        return(<RiWindyLine />)
      case 'snow':
        return(<IoMdSnow />)
      case 'temp':
        return(<BiSun />)
      default:
        return(<VscError />)
    }
  }

  return (
    <Container fluid id='products'>
      <IconContext.Provider value={{ color: "white", size: '50px' }}>
        <Row className={"justify-content-md-center hero-dark  hero-container"}>
          <Container className='hero-container'>
          <Row className='heading justify-content-md-center pd-20 mt-25'>
              {PRODUCTS.heading}
            </Row>
            <Row className='justify-content-md-center'>
              {PRODUCTS.text}
            </Row>
            <Row xs={1} md={2} lg={PRODUCT_CARDS_CONTENT.length <= 4 ? PRODUCT_CARDS_CONTENT.length : 3} className="justify-content-md-center mt-50">
              {PRODUCT_CARDS_CONTENT.map(pc => (<Col className='mt-25'>
                <Card variant="light" text='dark' className='shadow-sm'>
                  <Card.Header className={'centering pd-30 card-header-'+pc.color}>
                    {pc.heading}
                </Card.Header>
                  <Card.Body className={'card-'+pc.color}>
                    <Card.Title className='centering pd-20'>
                      {getIcon(pc.icon)}
                    </Card.Title>
                    <Card.Text>
                      {pc.details.map(detail => (<p className='text-lighter'>{detail}</p>))}
                  </Card.Text>
                  <div className={'centering'}>
                    <Link className={pc.active? '' : 'disabled'} to={'/products/'+pc.icon}>
                    <Button variant='outline-light' className={'mt-25 card-header-'+pc.color} disabled={!pc.active}>
                    {PRODUCTS.buttonText}
                  </Button>
                  </Link>
                  </div>
                  </Card.Body>
                </Card>
              </Col>))}
            </Row>
          </Container>
        </Row>
      </IconContext.Provider>
    </Container >
  );
}

export default ProductTable;