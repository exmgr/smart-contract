import React from 'react';
import { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { CONTRACT_TABLE } from '../../data/Data'
import * as CD from '../../data/ChainData'
import Web3 from 'web3';
import { FcNext, FcExpand } from 'react-icons/fc'
import { IconContext } from 'react-icons/lib';
import ContractTableRow from './ContractTableRow';
import ContractDetails from './ContractDetails';
import { Context } from '../../utils/Store';
let web3Instance = new Web3(CD.RPC);

const ContractTable = (props) => {
  const [state, dispatch] = useContext(Context);
  const [openContract, setOpenContract] = useState('');
  const [baseData, setBaseData] = useState('');
  const [list, setList] = useState('')

  const getContracts = async () => {
    let factoryContract = await new web3Instance.eth.Contract(CD.ICFACTORY_ABI, CD.ICFACTORY);
    let bd = await factoryContract.methods.getContractEntries(props.address).call();
    setBaseData(bd);
  }

  const onArrowClickHandler = async (address) => {
    if (openContract == address) {
      setOpenContract('');
    } else {
      setOpenContract(address);
    }
  }

  useEffect(async () => {
    if(!baseData) await getContracts();
    if(!list && baseData) setList(baseData)
  },[openContract, state.account, baseData, list])

  const setAll = () => {
    setList(baseData);
  }

  const setActive = () => {
    if(baseData.length > 0) filter(true)
  }

  const setInActive = () => {
    if(baseData.length > 0) filter(false)
  }

  

  const filter = (bool) => {
    let tmpList = [];
    baseData.map(c => {
      if(c.isActive == bool)
      tmpList.push(c)
    })
    setList(tmpList)
  }

  return (
    <>
      <Container className='pd-20 mt-25 mb-25 text-dark rounded-corners-small table-light medium-text'>
      {baseData && baseData.length != 0 && 
      <Row className='centering mb-15 bottom-line'>
        <span className='filter-text' onClick={setAll}>
          All 
        </span>
        <span>
          &nbsp;|&nbsp;
        </span>
        <span className='filter-text' onClick={setActive}>
          Active
        </span>
        <span>
          &nbsp;|&nbsp;
        </span>
        <span className='filter-text' onClick={setInActive}>
          Not Active
        </span>
        </Row>
        }
        <IconContext.Provider value={{ color: "grey", size: '30px' }}>
          {!baseData || baseData.length == 0 && CONTRACT_TABLE.table.history.noData}
          {list && list.length != 0 && 
          list.slice().reverse().map((bd) =>
          <>
           <Row className='mb-15 bottom-line'>
              <Row style={{ width: '100%' }} className=''>
                <Col xs='auto' className='mt-10 ml-15' onClick={() => { onArrowClickHandler(bd.insurance) }}>
                  {openContract == bd.insurance ? <FcExpand /> : <FcNext />}
                </Col>
                <Col>
                  {<ContractTableRow baseData={bd} />}
                  {openContract == bd.insurance &&
                    <ContractDetails address={bd.insurance} history={true} />
                  }
                </Col>
              </Row>

            </Row>
            </>
          )}
        </IconContext.Provider>
      </Container>
    </>
  );
}

export default ContractTable;