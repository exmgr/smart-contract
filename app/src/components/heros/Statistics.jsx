import React from 'react';
import { Context } from '../../utils/Store';
import { useContext, useEffect, useState } from 'react';
import * as CD from '../../data/ChainData';
import { CONTRACT_TABLE, FACTORY_OVERVIEW } from '../../data/Data';
import Web3 from 'web3';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ContractTable from '../tables/ContractTable';

let web3Instance = new Web3(CD.RPC);

const Statistics = () => {
  const [state, dispatch] = useContext(Context);
  const [linkContract, setLinkContract] = useState('');
  const [factoryContract, setFactoryContract] = useState('');
  const [linkBalance, setLinkBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [ensuredEth, setEnsuredEth] = useState(0);

  const initContracts = async () => {
    setLinkContract(await new web3Instance.eth.Contract(CD.ERC20_ABI, CD.LINK));
    setFactoryContract(await new web3Instance.eth.Contract(CD.ICFACTORY_ABI, CD.ICFACTORY));
  }

  const loadBalance = async () => {
    let linkWei = await linkContract.methods.balanceOf(CD.ICFACTORY).call();
    let linkEth = web3Instance.utils.fromWei(linkWei, 'ether');
    let ethWei = await web3Instance.eth.getBalance(CD.ICFACTORY);
    let eth = web3Instance.utils.fromWei(ethWei, 'ether');
    let eEthWei = await factoryContract.methods.ensuredBalance().call();
    let eEth = web3Instance.utils.fromWei(eEthWei, 'ether');
    setLinkBalance(linkEth);
    setEthBalance(eth);
    setEnsuredEth(eEth);
  }

  const chunkString = (s) => {
    return s.match(/.{1,7}/g);
  }

  useEffect(async () => {
    if (!linkContract || !factoryContract) await initContracts();
    if (linkContract && factoryContract) await loadBalance();
  }, [linkContract, factoryContract, ethBalance, ensuredEth, state.modal])

  return (
    <Container fluid id='statistics'>
      <Row className="justify-content-md-center hero-lighter standard-text">
        <Container className='hero-container mt-50 pd-20'>
          <Row className='heading justify-content-md-center pd-20 text-lighter'>
            {FACTORY_OVERVIEW.heading}
          </Row>
          <Row className='justify-content-md-center text-lighter'>
            {FACTORY_OVERVIEW.text}
          </Row>
          <Row className='medium-text mt-50 text-lighter bold'>
            <p>{FACTORY_OVERVIEW.contractFactory}</p>
          </Row>
          <Row className='medium-text text-lighter break'>
            {chunkString(CD.ICFACTORY).map(chunk => <span className='break'>{chunk}</span>)}
          </Row>
          <Row className='pd-30 mt-25' xs={1} md={2} lg={4}>
            <Col>
              <Card className='mt-25' bg='light'>
                <Card.Header className='medium-text bold centering card-header card-header-pink '>{FACTORY_OVERVIEW.link}</Card.Header>
                <Card.Body className='card-pink'>
                  <Card.Text className='centering'>
                    {linkBalance}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className='mt-25' bg='light'>
                <Card.Header className='medium-text bold centering card-header card-header-pink '>{FACTORY_OVERVIEW.eth}</Card.Header>
                <Card.Body className='card-pink'>
                  <Card.Text className='centering'>
                    {ethBalance}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className='mt-25' bg='light'>
                <Card.Header className='medium-text bold centering card-header card-header-pink '>{FACTORY_OVERVIEW.ensuredEth}</Card.Header>
                <Card.Body className='card-pink'>
                  <Card.Text className='centering'>
                    {ensuredEth}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className='mt-25' bg='light'>
                <Card.Header className='medium-text bold centering card-header card-header-pink '>{FACTORY_OVERVIEW.notEnsuredEth}</Card.Header>
                <Card.Body className='card-pink'>
                  <Card.Text className='centering'>
                    {(ethBalance - ensuredEth).toFixed(2)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Container className="mt-50 text-lughter bold mb-25">
            {CONTRACT_TABLE.table.heading}
          </Container>
          <div className='mb-25 pb-60'>
          <ContractTable address={CD.ICFACTORY}/>
          </div>
        </Container>
      </Row>
    </Container>
  );
}

export default Statistics;