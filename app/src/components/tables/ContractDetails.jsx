import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../utils/Store';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as CD from '../../data/ChainData'
import { dateOptions, timeOptions, dateLocale, CONTRACT_TABLE } from '../../data/Data'
import { IconContext } from 'react-icons/lib';
import { HiOutlineExternalLink } from 'react-icons/hi';
import SetEndDate from '../admin/SetEndDate';
import Web3 from 'web3';

let web3Instance = new Web3(CD.RPC);

const ContractDetails = (props) => {
  const [state, dispatch] = useContext(Context);
  const [contractDetails, setContractDetails] = useState('');


  const createContractDetails = async () => {
    let contract = await new web3Instance.eth.Contract(CD.INSURANCE_ABI, props.address);
    let data = await contract.methods.getAllContractData().call();
    setContractDetails(data)
    console.log(data)
  }

  const chunkString = (s) => {
    return s.match(/.{1,7}/g);
  }

  useEffect(() => {
    if(!contractDetails) createContractDetails();
  },[contractDetails])


  if(!contractDetails) return(<div></div>)

  return (
    <div>
      <Row className='pd-30'>
                      <Col xs="auto">
                        <Row className='standard-text bold pd-10'>
                          {CONTRACT_TABLE.table.details.heading}
                        </Row>
                        <Row>
                          <Col xs='auto' className='bold pd-10'>
                            {CONTRACT_TABLE.table.details.factory}
                          </Col>
                          <Col>
                            <a className='no-text-decoration text-dark pd-10 break small-medium-text' target="_blank"
                              href={'https://kovan.etherscan.io/address/' + contractDetails[1]}>
                              {chunkString(contractDetails[1]).map((s) => <span className='break'>{s}</span>)}
                              <IconContext.Provider value={{ size: '15px' }}>
                              <>&nbsp;<HiOutlineExternalLink /></>
                              </IconContext.Provider>
                            </a>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='auto' className='bold pd-10'>
                            {CONTRACT_TABLE.table.details.creator}
                          </Col>
                          <Col>
                            <a className='no-text-decoration text-dark pd-10 break small-medium-text' target="_blank"
                              href={'https://kovan.etherscan.io/address/' + contractDetails[0]}>
                              {chunkString(contractDetails[0]).map((s) => <span className='break'>{s}</span>)}
                              <IconContext.Provider value={{ size: '15px' }}>
                              <>&nbsp;<HiOutlineExternalLink /></>
                              </IconContext.Provider>
                            </a>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='auto' className='bold pd-10'>
                            {CONTRACT_TABLE.table.details.location}
                          </Col>
                          <Col xs='auto' className='pd-10'>
                            {contractDetails[3]}
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='auto' className='bold pd-10'>
                            {CONTRACT_TABLE.table.details.endDate}
                          </Col>
                          <Col xs='auto' className='pd-10'>
                            {new Date(contractDetails[6] * 1000).toLocaleDateString(dateLocale, dateOptions) + ' ' + new Date(contractDetails[5] * 1000).toLocaleTimeString(dateLocale, timeOptions)}
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='auto' className='bold pd-10'>
                            {CONTRACT_TABLE.table.details.weatherCon}
                          </Col>
                          <Col xs='auto' className='pd-10'>
                            {(contractDetails[8] / 100).toFixed(2)}
                          </Col>

                          <Col xs='auto' className='pd-10'>
                            <span className='bold'>{CONTRACT_TABLE.table.details.threshold}</span>
                            <span>&nbsp;{contractDetails[7]+' %'}</span>
                          </Col>

                          
                        </Row>
                        <Row>
                          <Col xs='auto' className='pd-10'>
                            <span className='bold'>{CONTRACT_TABLE.table.details.threshold}</span>
                            <span>&nbsp;{contractDetails[7]+' %'}</span>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='auto' className='pd-10'>
                            <span className='bold'>{CONTRACT_TABLE.table.details.max}</span>
                            <span>&nbsp;{(contractDetails[9] / 100).toFixed(2)}</span>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs='auto' className='pd-10'>
                            <span className='bold'>{CONTRACT_TABLE.table.details.min}</span>
                            <span>&nbsp;{(contractDetails[10] / 100).toFixed(2)}</span>
                          </Col>
                        </Row>
                      </Col>
                      {props.history && 
                      <Col>
                        <Row className='standard-text bold pd-10'>
                          {CONTRACT_TABLE.table.history.heading}
                        </Row>
                        {contractDetails[12].length == 0 && CONTRACT_TABLE.table.history.noData}
                        {contractDetails[12].length != 0 && contractDetails[12].map(data => (<>
                          <Row >
                            <Col xs='auto' className='bold pl-10'>
                              {CONTRACT_TABLE.table.history.date}
                            </Col>
                            <Col xs='auto' className='pl-10'>
                              {new Date(data.date * 1000).toLocaleDateString(dateLocale, dateOptions) + ' ' + new Date(data.date * 1000).toLocaleTimeString(dateLocale, timeOptions)}
                            </Col>
                            <Col xs='auto' className='bold pl-10'>
                              {CONTRACT_TABLE.table.history.value}
                            </Col>
                            <Col xs='auto' className='pl-10'>
                              {(data.value / 100).toFixed(2)}
                            </Col>
                          </Row>
                        </>))}
                      </Col>}
                    </Row>
                    {state.account && <SetEndDate address={props.address} />}
    </div>
  );
}

export default ContractDetails;