import React from 'react';
import { Context } from '../../utils/Store';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IconContext } from 'react-icons/lib';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CONTRACT_TABLE } from '../../data/Data'
import { BsPerson } from 'react-icons/bs'
import ContractTable from '../tables/ContractTable';


const User = () => {
  let history = useHistory();
  const [state, dispatch] = useContext(Context);


  useEffect(async () => {

  }, state.modal)

  if (!state.account) history.push("/");

  return (
    <Container fluid id='user'>
      <IconContext.Provider value={{ color: "#313c61", size: '70px' }}>
        <Row style={{ minHeight: '93vh' }} className="justify-content-md-center hero-dark standard-text hero-container">
          <Container className='hero-container mt-50'>
            <Row className={'break no-wrap pd-10 hero-lighter text-darker rounded-corners-small mt-50 width-100'}>
              <span className='in-a-row break bg-light rounded-corners-small'><BsPerson /></span>
              <span className='ml-15 pd-10 heading break text-light'>{CONTRACT_TABLE.heading}</span>
            </Row>
            <Row className='mt-50' >
              {CONTRACT_TABLE.text}
            </Row>
            <Container className="mt-50 text-lighter bold">
              {CONTRACT_TABLE.table.heading}
            </Container>
            <ContractTable address={state.account} />
          </Container>
        </Row>
      </IconContext.Provider>
    </Container>
  );
}

export default User;