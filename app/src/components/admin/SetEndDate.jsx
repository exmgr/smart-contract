import React from 'react';
import { Context } from '../../utils/Store';
import { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ADMIN } from '../../data/Data'
import * as CD from '../../data/ChainData'
import Button from 'react-bootstrap/Button'

const SetEndDate = (props) => {
  const [state, dispatch] = useContext(Context);
  const [admin, setAdmin] = useState(false);

  const isAdmin = async () => {
    let bool = await state.icfactory.methods.admins(state.account).call();
    setAdmin(bool);
  }

  const send = async () => {
    const data = state.icfactory.methods.setEndDateNow(props.address).encodeABI();
    const args = { from: state.account, to: CD.ICFACTORY, data }
    await dispatch({ type: 'SET_TX', payload: args });
    setTimeout(async () => {
      await dispatch({ type: 'SET_MODAL', payload: true });
    }, 1000)
  }

  useEffect(() => {
    if (state.icfactory && state.account) isAdmin();
  }, [state.account, state.modal, admin])

  return (
    <div>
      {admin &&
        <div>
          <Row className='pl-20'>
            Admin:
          </Row>
          <Row className='pl-10'>
            <Col className='pd-10 bold' xs="auto">
              {ADMIN.setEndDate}
            </Col>
            <Col>
              <Button onClick={send}>
                {ADMIN.setEndDateButton}
              </Button>
            </Col>
          </Row>
        </div>}
    </div>
  );
}

export default SetEndDate;