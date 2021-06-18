import React from 'react';
import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Context } from '../../utils/Store';
import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'
import { BiCloudLightRain } from 'react-icons/bi'
import { IoMdSnow } from 'react-icons/io'
import { RiWindyLine } from 'react-icons/ri'
import { BiSun } from 'react-icons/bi'
import { IconContext } from 'react-icons/lib';
import { VscError } from 'react-icons/vsc'
import * as CD from '../../data/ChainData';
import { PRODUCT_CARDS_CONTENT, PRODUCT_FORM, wrongNetwork } from '../../data/Data'
import Web3 from 'web3';
import { useHistory } from 'react-router';

let web3Instance = new Web3(CD.RPC);

const CreateForm = (props) => {
  const [linkContract, setLinkContract] = useState('');
  const [factoryContract, setFactoryContract] = useState('');
  const [state, dispatch] = useContext(Context);
  const [buttonMsg, setButtonMsg] = useState(wrongNetwork)
  const [type, setType] = useState(props.product);
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState('');
  const [condition, setCondition] = useState('');
  const [period, setPeriod] = useState('');
  const [threshold, setThreshold] = useState('10');
  const [ensuredBy, setEnsuredBy] = useState('5');
  const [cronPeriod, setCronPeriod] = useState(PRODUCT_FORM.cron.dailyExecutions);
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState([]);

  const [error, setError] = useState(false);
  const [generalError, setGeneralError] = useState(PRODUCT_FORM.error.general);
  const [cropError, setCropError] = useState('');
  const [ensuredError, setEnsuredError] = useState('');
  const [periodError, setPeriodError] = useState('');
  const [cronError, setCronError] = useState('');

  const [color, setColor] = useState('')

  const [text, setText] = useState('');
  const [heading, setHeading] = useState('');
  const [thresh, setThresh] = useState('')

  let history = useHistory();

  const initContracts = async () => {
    setLinkContract(await new web3Instance.eth.Contract(CD.ERC20_ABI, CD.LINK));
    setFactoryContract(await new web3Instance.eth.Contract(CD.ICFACTORY_ABI, CD.ICFACTORY));
  }

  const validateInput = async () => {
    if (
      checkLocation() && checkProducts() &&
      checkCondition() && checkThreshold() &&
      await checkCrop() && await checkEnsured() &&
      await checkPeriod() && await checkCron()
    ) {
      setError(false)
      return true;
    }
    checkLocation()
    checkProducts()
    checkCondition()
    checkThreshold()
    await checkCrop()
    await checkEnsured()
    await checkPeriod()
    await checkCron()
    setError(true)
    return false;
  }

  const checkLocation = () => {
    return location != '';
  }

  const checkProducts = () => {
    return product != '';
  }

  const checkCondition = () => {
    return condition != '' && condition > 0;
  }

  const checkThreshold = () => {
    return threshold != '';
  }

  const checkCrop = async () => {
    if (crop == '' && crop == 0) return false;
    let ethWei = await web3Instance.eth.getBalance(CD.ICFACTORY);
    let eth = web3Instance.utils.fromWei(ethWei, 'ether');
    let eEthWei = await factoryContract.methods.ensuredBalance().call();
    let eEth = web3Instance.utils.fromWei(eEthWei, 'ether');

    if (eth - eEth >= crop) {
      setCropError('');
      return true;
    }

    setCropError(PRODUCT_FORM.error.crop)
    return false;
  }

  const checkEnsured = async () => {
    if (ensuredBy == '') return false;
    let ethWei = await web3Instance.eth.getBalance(state.account);
    let eth = web3Instance.utils.fromWei(ethWei, 'ether');

    if (eth >= crop * ensuredBy / 100) {
      setEnsuredError('');
      return true;
    }

    setEnsuredError(PRODUCT_FORM.error.ensured)
    return false;
  }

  const checkPeriod = async () => {
    if (period == '') return false;
    let linkWei = await linkContract.methods.balanceOf(CD.ICFACTORY).call();
    let linkEth = web3Instance.utils.fromWei(linkWei, 'ether');
    let n = 0;

    cronPeriod != '' ? n = cronPeriod : n = 1;
    let neededLink = (30 * period * n * 0.1) + 0.5;

    if (linkEth >= neededLink) {
      setPeriodError('');
      return true;
    }

    setPeriodError(PRODUCT_FORM.error.period)
    return false;
  }

  const checkCron = async () => {
    if (cronPeriod == '') return false;
    let linkWei = await linkContract.methods.balanceOf(CD.ICFACTORY).call();
    let linkEth = web3Instance.utils.fromWei(linkWei, 'ether');
    let n = 0;

    period != '' ? n = period : n = 1;
    let neededLink = (30 * cronPeriod * n * 0.1) + 0.5;

    if (linkEth >= neededLink) {
      setCronError('');
      return true;
    }

    setCronError(PRODUCT_FORM.error.cron)
    return false;
  }

  const getIcon = (icon) => {
    switch (icon) {
      case 'rain':
        return (<BiCloudLightRain />)
      case 'wind':
        return (<RiWindyLine />)
      case 'snow':
        return (<IoMdSnow />)
      case 'temp':
        return (<BiSun />)
      default:
        return (<VscError />)
    }
  }

  const setData = (t) => {
    switch (t.toLowerCase()) {
      case 'rain':
        setText(PRODUCT_FORM.text.rain);
        setThresh(PRODUCT_FORM.threshold.rain)
        return;
      case 'wind':
        setText(PRODUCT_FORM.text.wind);
        setThresh(PRODUCT_FORM.threshold.wind)
        return;
      case 'snow':
        setText(PRODUCT_FORM.text.snow);
        setThresh(PRODUCT_FORM.threshold.snow)
        return;
      case 'temp':
        setText(PRODUCT_FORM.text.temp);
        setThresh(PRODUCT_FORM.threshold.temp)
        return;
      default:
        setText("Error");
        return;
    }
  }

  const setProductData = () => {
    let plist = [];
    CD.PRODUCTS.map(p => {
      if (p[0].toUpperCase().includes(type.toUpperCase())) {
        plist.push(p);
      }
    })
    setProductList(plist);
    PRODUCT_CARDS_CONTENT.map(p => {
      if (p.icon == type) {
        setColor(p.color)
        setHeading(p.heading)
      }
    })
  }

  useEffect(async () => {
    console.log(state.netid == CD.NETWORK_ID)
    if(!text || !thresh) setData(type)
    if (state.account && (state.netid == CD.NETWORK_ID)) setButtonMsg('');
    if (state.account && (state.netid != CD.NETWORK_ID)) setButtonMsg(wrongNetwork);

    if (!color) setProductData();
    if (!linkContract && !factoryContract) initContracts();
  }, [state.account, state.netid, productList, error, generalError, cropError, ensuredError, periodError, cronError]);

  const onChangeHandler = (e) => {
    switch (e.target.id) {
      case 'type':
        setType(e.target.value)
        break;
      case 'location':
        setLocation(e.target.value)
        break;
      case 'crop':
        setCrop(e.target.value)
        break;
      case 'condition':
        setCondition(e.target.value)
        break;
      case 'period':
        setPeriod(e.target.value)
        break;
      case 'threshold':
        setThreshold(e.target.value)
        break;
      case 'ensuredBy':
        setEnsuredBy(e.target.value)
        break;
      case 'cronPeriod':
        console.log(e.target.value)
        setCronPeriod(e.target.value)
        break;
      case 'product':
        setProduct(e.target.value.split(','));
        break;

      default:
        break;
    }
  }

  const onClickHandler = () => {
    console.log('type: ' + type);
    console.log('location: ' + location);
    console.log('crop: ' + crop);
    console.log('condition: ' + condition);
    console.log('period: ' + period);
    console.log('threshold: ' + threshold);
    console.log('ensuredBy: ' + ensuredBy);
    console.log('cronperiod: ' + cronPeriod)
    console.log('product: ')
    console.log(product)
    send();
  }

  const send = async () => {
    if (await validateInput()) {
      var cropWei = state.web3.utils.toWei(crop, "ether");
      const data = state.icfactory.methods.createNewContract(product, location, cropWei, condition * 100, period, threshold, ensuredBy, cronPeriod).encodeABI();
      const value = cropWei / 100 * ensuredBy;
      const args = { from: state.account, to: CD.ICFACTORY, value: value, data }
      await dispatch({ type: 'SET_TX', payload: args });
      setTimeout(async () => {
        history.push('/send')
      }, 1000)
    }
  }

  return (
    <>
      <Container fluid>
        <IconContext.Provider value={{ color: "white", size: '70px' }}>
          <Row className={"justify-content-md-center standard-text text-lighter hero-light pd-20"}>
            <Container className={'hero-container smaller-form-container'}>
              <Row className={'no-wrap width-100 mt-50 pd-10 element-' + color}>
                <span className='break'>{getIcon(type)}</span>
                <span className='ml-15 pd-10 heading break'>{heading}</span>
              </Row>
              <Row className='mt-50' >
                {text}
              </Row>
              <Row className='mt-50' xs={1} md={2}>
                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.location}<span className='text-light-red bold'> *</span></p>
                  <select class="form-control smaller-form" id="location" onChange={onChangeHandler}>
                    <option value='' disabled selected>select..</option>
                    {PRODUCT_FORM.cities.map(city => (
                      <option value={city}>{city}</option>
                    ))}
                  </select>
                </Col>

                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.products}<span className='text-light-red bold'> *</span></p>
                  <select class="form-control smaller-form" id="product" onChange={onChangeHandler}>
                    <option value='' disabled selected>select..</option>
                    {productList && productList.map(p => (
                      <option value={p}>{p.join(" and ")}</option>
                    ))}
                  </select>
                </Col>
              </Row>

              <Row className='mt-50' xs={1} md={2}>
                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.condition}<span className='text-light-red bold'> *</span></p>
                  <input type="text" class="form-control smaller-form" id="condition" placeholder="e.g. 20" required="required" onChange={onChangeHandler} />
                </Col>

                <Col className='smaller-col'>
                  <p>{thresh}<span className='text-light-red bold'> *</span></p>
                  <select class="form-control smaller-form" id="threshold" onChange={onChangeHandler}>
                    <option disabled selected value="10">10%</option>
                  </select>
                </Col>
              </Row>
              <Row className='mt-50' xs={1} md={2}>
                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.crop}<span className='text-light-red bold'> * </span><span className='text-light-red medium-text'>{cropError}</span></p>
                  <input type="text" class="form-control smaller-form" id="crop" placeholder="0.1" required="required" onChange={onChangeHandler} />
                </Col>
                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.ensure}<span className='text-light-red bold'> * </span><span className='text-light-red medium-text'>{ensuredError}</span></p>
                  <select class="form-control smaller-form" id="ensuredBy" onChange={onChangeHandler}>
                    <option disabled selected value="5">5%</option>
                  </select>
                </Col>
              </Row>

              <Row className='mt-50' xs={1} md={2}>
                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.period}<span className='text-light-red bold'> * </span><span className='text-light-red medium-text'>{periodError}</span></p>
                  <select class="form-control smaller-form" id="period" onChange={onChangeHandler}>
                    <option value='' disabled selected>select..</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </Col>
                <Col className='smaller-col'>
                  <p>{PRODUCT_FORM.cronPeriod}<span className='text-light-red bold'> * </span><span className='text-light-red medium-text'>{cronError}</span></p>
                  <select class="form-control smaller-form" id="cronPeriod" onChange={onChangeHandler}>
                    <option disabled selected value={PRODUCT_FORM.cron.dailyExecutions}>{PRODUCT_FORM.cron.title}</option>
                    {/* {PRODUCT_FORM.cron.map(c => (
                      <option value={c.dailyExecutions}>{c.title}</option>
                    ))} */}
                  </select>
                </Col>

              </Row>

              <Row className='justify-content-md-center mt-50' xs={1} md={2}>
                <Button variant='outline-light' className={'pd-20 medium-text mt-50 card-' + color} disabled={buttonMsg} onClick={onClickHandler}>{PRODUCT_FORM.buttonText}</Button>
              </Row>
              <Row className='justify-content-md-center '>
                <p>{buttonMsg}</p>
                {error && <p className='text-light-red mt-10'>{generalError}</p>}
              </Row>
            </Container>
          </Row>
        </IconContext.Provider>
      </Container>
    </>
  );
}

export default CreateForm;