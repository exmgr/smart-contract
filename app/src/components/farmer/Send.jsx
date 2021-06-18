import React from 'react';
import { Context } from '../../utils/Store';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IconContext } from 'react-icons/lib';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as CD from '../../data/ChainData'
import { HiOutlineExternalLink } from 'react-icons/hi';
import { SEND_PAGE } from '../../data/Data'
import loading from '../../data/img/loading.gif'
import ContractTableRow from '../tables/ContractTableRow';
import ContractDetails from '../tables/ContractDetails';
import Button from 'react-bootstrap/esm/Button';
import { FcOk, FcCancel } from 'react-icons/fc'


const Send = () => {
  const [state, dispatch] = useContext(Context);
  const [heading, setHeading] = useState(SEND_PAGE.heading_waiting);
  const [hash, setHash] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [img, setImg] = useState(<img src={loading} alt="img" style={{ height: "50px", width: "50px" }} />);
  const [txLock, setTxLock] = useState(false);
  const [error, setError] = useState(false);

  const [statusConfirmed, setStatusConfirmed] = useState(false)
  const [statusSend, setStatusSend] = useState(false)
  const [statusSuccess, setStatusSuccess] = useState(false)
  const [baseData, setBaseData] = useState('');

  let history = useHistory();

  const goBack = () => {
    history.push(SEND_PAGE.button.to)
  }

  const getContractData = async () => {
    let factoryContract = await new state.web3.eth.Contract(CD.ICFACTORY_ABI, CD.ICFACTORY);
    let bd = await factoryContract.methods.getContractEntries(state.account).call();

    setBaseData(bd[bd.length - 1]);
    return;
  }
  const sendTx = async () => {
    state.web3.eth.sendTransaction(state.tx)
      .on("transactionHash", async (h) => {
        setStatusConfirmed(true);
        setHeading(SEND_PAGE.heading_pending);
        setHash(h);
      })
      .on('receipt', async (receipt) => {
        setStatusSend(true)
      })
      .on("confirmation", async (confirmationNumber, receipt) => {
        if (confirmationNumber == 4) {
          console.log("tx success");
          setStatusSuccess(true)
          setHeading(SEND_PAGE.heading_success);
          setImg(
            <IconContext.Provider value={{ size: '60px' }}>
                  <FcOk />
            </IconContext.Provider>
          );
          getContractData();
          setBtnDisabled(false);
          await dispatch({ type: 'SET_TX', payload: '' });
        }
      })
      .on("error", async (error) => {
        console.log("tx error");
        setError(true)
        setHeading(SEND_PAGE.heading_error);
        setImg(
          <IconContext.Provider value={{ size: '60px' }}>
                  <FcCancel />
            </IconContext.Provider>
        );
        setBtnDisabled(false);
        await dispatch({ type: 'SET_TX', payload: '' });
      })
  }

  useEffect(() => {
    if (!txLock && state.tx) {
      setTxLock(true);
      sendTx();
    }
  }, [heading, hash, img, btnDisabled, baseData])

  if (!state.tx && !txLock) { history.push('/') } // do stuff

  return (
    <Container fluid id='user'>
      <Row style={{ minHeight: '93vh' }} className="justify-content-md-center hero-dark standard-text hero-container">
        <Container className='hero-container'>
          <Row className={'mt-100 pd-10 hero-lighter text-light rounded-corners-small'}>
            <Col xs='auto' className='pd-10'>
              {img}
            </Col>
            <Col className='ml-15 pd-10 heading'>
              {heading}
            </Col>
          </Row>
          <Row className='mt-25' >
            {SEND_PAGE.text}
          </Row>
          <Container className='pd-20 mt-50 text-dark rounded-corners-small table-light medium-text'>
            {!statusConfirmed && <p className='text-dark'>{SEND_PAGE.message_waiting_before}</p>}
            {statusConfirmed && <p>{SEND_PAGE.message_waiting_after}</p>}

            {!statusSend && <p className='text-dark'>{SEND_PAGE.message_transaction_before}</p>}
            {statusSend && <p>{SEND_PAGE.message_transaction_after}
              <a className='no-text-decoration' target="_blank" href={'https://kovan.etherscan.io/tx/' + hash}>{hash}
                <IconContext.Provider value={{ size: '15px' }}>
                  <HiOutlineExternalLink />
                </IconContext.Provider>
              </a>
            </p>}

            {!statusSuccess && <p className='text-dark'>{SEND_PAGE.message_success_before}</p>}
            {statusSuccess && <p>{SEND_PAGE.message_success_after}</p>}

            {!statusSuccess && <Row className='standard-text text-dark bold pd-20 mb-25'>
              {SEND_PAGE.heading_contract_details}
            </Row>}
            
            {statusSuccess && <Row className='standard-text bold pd-20 mb-25'>
              {SEND_PAGE.heading_contract_details}
            </Row>}
            

            {baseData && <div className='mt-10 pd-20'>
              <ContractTableRow baseData={baseData} />
              <ContractDetails address={baseData.insurance} />
            </div>}

            {error && <p className='text-red-light bold'>{SEND_PAGE.message_error}</p>}
          </Container>
          <Row className='centering pd-20 mt-50'>
            <Button className='connect-button primary pd-10 no-text-decoration' disabled={btnDisabled} onClick={goBack} >{SEND_PAGE.button.text}</Button>
          </Row>
        </Container>
      </Row>
    </Container>
  );
}

export default Send;