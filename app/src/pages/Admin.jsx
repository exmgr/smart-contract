import React from 'react';
import { Context } from '../utils/Store';
import { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as CD from '../data/ChainData'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { useHistory } from 'react-router';

const Admin = (props) => {
  let history = useHistory();
  const [state, dispatch] = useContext(Context);
  const [admin, setAdmin] = useState(false);
  const [adminAddress, setAdminAddress] = useState('')
  const [jobname, setjobname] = useState('')
  const [jobid, setjobid] = useState('')
  const [jobsource, setjobsource] = useState('')

  const isAdmin = async () => {
    let bool = await state.icfactory.methods.admins(state.account).call();
    if (!bool) history.push("/");
    setAdmin(bool);
  }

  const executeCronTask = async () => {
    const data = state.icfactory.methods.executeCronTask().encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }

  const withdrawAll = async () => {
    const data = state.icfactory.methods.withdrawAll().encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }
  const withdrawNotEnsured = async () => {
    const data = state.icfactory.methods.withdrawNotEnsuredBalance().encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }

  const addAdmin = async () => {
    const data = state.icfactory.methods.setAdmin(adminAddress).encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }

  const removeAdmin = async () => {
    const data = state.icfactory.methods.removeAdmin(adminAddress).encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }
  const removeJob = async () => {
    const data = state.icfactory.methods.removeJob(jobname).encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }

  const addJob = async () => {
    const data = state.icfactory.methods.setJob(jobname, jobid, jobsource).encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }


  const onChangeHandler = (e) => {
    switch (e.target.id) {
      case 'admin':
        setAdminAddress(e.target.value)
        break;
      case 'jobName':
        setjobname(e.target.value)
        break;
      case 'jobid':
        setjobid(e.target.value)
        break;
      case 'jobsource':
        setjobsource(e.target.value)
        break;

      default:
        break;
    }
  }

  useEffect(async () => {
    if (state.icfactory && state.account) { 
      await isAdmin();
    } else {
     history.push("/");
    }
  }, [state.account, state.modal, admin])

  return (
        <Container fluid>
          { admin && <Row className={"justify-content-md-center medium-text text-lighter hero-light "}>
            <Container className={'hero-container smaller-form-container mt-100'}>
              <Row>
              <Col className='ml-15 pd-10 mb-15 heading'>
                  ADMIN
                </Col>
              </Row>
              <Row className='pl-20 pd-20 mb-15 '>
                <Col xs='auto'>
                Manual execution of all active contracts:
            </Col>
            <Col xs='auto'>
                  <Button onClick={executeCronTask}>Send</Button>
                </Col>
              </Row>
              <Row className='mt-100 bold'>
                <Col>
                Development only features
                </Col>
              </Row>
              <hr className='fat'></hr>
              <Row className='pl-20 pd-20 mb-15 '>
              <Col xs='auto'>
              Withdraw all ETH & LINK from factory contract:
            </Col>
            <Col xs='auto'>
                  <Button onClick={withdrawAll}>Send</Button>
                </Col>
              </Row>

              <Row className='pl-20 pd-20 mb-15 '>
              <Col xs='auto'>
              Withdraw available ETH & LINK from factory contract:
            </Col>
            <Col xs='auto'>
                  <Button onClick={withdrawNotEnsured}>Send</Button>
                </Col>
              </Row>

              <Row className='pl-20 pd-20 mb-15 '>
                <Col xs='auto'>
                Assign new admin wallet:
            </Col>
                <Col xs='auto'>
                  <input type="text" class="form-control smaller-form" id="admin" placeholder="Wallet address (0x123456789..)" required="required" onChange={onChangeHandler} />
                </Col>
                <Col>
                  <Button onClick={addAdmin}>Send</Button>
                </Col>
              </Row>

              <Row className='pl-20 pd-20 mb-15 '>
                <Col xs='auto'>
                  Remove admin wallet:
            </Col>
                <Col xs='auto'>
                  <input type="text" class="form-control smaller-form" id="admin" placeholder="Wallet address" required="required" onChange={onChangeHandler} />
                </Col>
                <Col xs='auto'>
                  <Button onClick={removeAdmin}>Send</Button>
                </Col>
              </Row>

              <Row className='pl-20 pd-20 mb-15 '>
              <Row className='pl-20 pd-20 mb-15 '>
                  <Col xs='auto'>
                  Add new CHAINLINK job:
            </Col>
                  <Col>
                    <input type="text" class="form-control smaller-form" id="jobName" placeholder="Name, e.g.: EXM Snow" required="required" onChange={onChangeHandler} />
                  </Col>
                  <Col>
                    <input type="text" class="form-control smaller-form" id="jobid" placeholder="Job ID: 0x......." required="required" onChange={onChangeHandler} />
                  </Col>
                </Row>
                <Row className='pl-20 pd-20 mb-15 '>
                  <Col style={{width: '210px'}}>
                   
                </Col>
                  <Col xs='auto'>
                    <select class="form-control smaller-form" id="jobsource" onChange={onChangeHandler}>
                      <option value='' disabled selected>Select Source</option>
                      <option value="exm">EXM</option>
                      <option value="owm">Openweathermap</option>
                    </select>
                  </Col>
                  <Col xs='auto'>
                    <Button onClick={addJob}>Send</Button>
                  </Col>
                </Row>
              </Row>

              <Row className='pl-20 pd-20 mb-15 '>
                <Col xs='auto'>
                Remove CHAINLINK job:
              </Col>
                <Col xs='auto'>
                  <input type="text" class="form-control smaller-form" id="jobName" placeholder="Name, e.g.: EXM Wind" required="required" onChange={onChangeHandler} />
                </Col>
                <Col>
                  <Button onClick={removeJob}>Send</Button>
                </Col>
              </Row>
            </Container>
          </Row> }
        </Container>
  );
}

export default Admin;