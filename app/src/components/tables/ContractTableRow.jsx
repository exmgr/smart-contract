import React, { useEffect, useState } from 'react';
import { dateOptions, timeOptions, dateLocale, CONTRACT_TABLE } from '../../data/Data'
import { IconContext } from 'react-icons/lib';
import { HiOutlineExternalLink } from 'react-icons/hi';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as CD from '../../data/ChainData'
import Web3 from 'web3';

let web3Instance = new Web3(CD.RPC);

const ContractTableRow = (props) => {
  const [crop, setCrop] = useState('');
  const [products, setProducts] = useState([]);
  const [insurance, setInsurance] = useState('');
  const [linkContract, setLinkContract] = useState('');
  const [link, setLink] = useState('')

  const initContract = async () => {
    let i = await new web3Instance.eth.Contract(CD.INSURANCE_ABI, props.baseData.insurance);
    setLinkContract(await new web3Instance.eth.Contract(CD.ERC20_ABI, CD.LINK));
    setInsurance(i);
  }

  const chunkString = (s) => {
    return s.match(/.{1,7}/g);
  }

  const initProducts = async () => {
    let p = [];
    props.baseData.joblist.map( job => {
      p.push(job[0]);
    })
    setProducts(p)
  }

  const getCrop = async () => {
    let c = await insurance.methods.getCrop().call();
    setCrop(c)
  }

  const getLink = async () => {
    if(props.baseData.insurance != 'undefined') {
      try {
        let linkWei = await linkContract.methods.balanceOf(props.baseData.insurance).call();
        let linkEth = web3Instance.utils.fromWei(linkWei, 'ether');
        setLink(linkEth);
      } catch (error) {
        console.log(error)
        console.log(props.baseData)
      }
    }
  }

  useEffect(() => {
    if(!insurance || !linkContract) initContract();
    if(insurance && !crop) getCrop();
    if(products.length === 0) initProducts();
    if(!link && linkContract) getLink();
  },[crop, insurance, products])

  return (
  <div>
    <Row className="pl-10" >
      <Col xs="auto">
        {CONTRACT_TABLE.table.address}
      </Col>
      <Col xs='auto'>
        <a className='no-text-decoration text-dark break small-medium-text' target="_blank"
          href={'https://kovan.etherscan.io/address/' + props.baseData.insurance}>
          {chunkString(props.baseData.insurance).map((s) => <span>{s}</span>)}
          <IconContext.Provider value={{ size: '15px' }}>
            <>&nbsp;<HiOutlineExternalLink /></>
          </IconContext.Provider>
        </a>
      </Col>
      <Col>
      </Col>
      <Col xs='auto' className='no-wrap'>
        <span className=''>
          {CONTRACT_TABLE.table.dateAdded}
        </span>
        {new Date(props.baseData.creationDate * 1000).toLocaleDateString(dateLocale, dateOptions) + ' ' + new Date(props.baseData.creationDate * 1000).toLocaleTimeString(dateLocale, timeOptions)}
      </Col>
      <Col xs='auto' className='size-150'>
      <span className='no-wrap text-right'>
          {CONTRACT_TABLE.table.link}
        </span>
        {link}
      </Col>
    </Row>
    <Row className="pl-10">
      <Col xs='auto' className='no-wrap'>
        <span className='no-wrap'>
          {CONTRACT_TABLE.table.crop}
        </span>
        {web3Instance.utils.fromWei(crop, "ether")}
      </Col>
      <Col xs='auto' className='break in-a-row'>
        <span className='breakin-a-row'>
          <span className='break in-a-row'>{CONTRACT_TABLE.table.products}</span><span className='breakin-a-row'>&nbsp;{products.join(", ")}</span>
        </span>
      </Col>
      <Col>
      </Col>
      <Col className={!props.baseData.isActive ? ' text-red text-right' : 'text-green text-right no-wrap'}>
        {!props.baseData.isActive ? CONTRACT_TABLE.table.notActive : CONTRACT_TABLE.table.active}
      </Col>
    </Row>
  </div>
  );
}

export default ContractTableRow;