import React from 'react';
import { Context } from '../../utils/Store';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../data/img/agroxm-logo-wide.png'
import { WEBSITE_NAME, MENU_LINKS, wrongNetwork } from '../../data/Data';
import Login from '../web3/Login';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { BsPerson } from 'react-icons/bs'
import { IconContext } from 'react-icons/lib';
import * as CD from '../../data/ChainData';
import { wronGNetwork } from '../../data/Data'
import Button from "react-bootstrap/Button";

const Header = () => {
  const [state, dispatch] = useContext(Context);
  const [userIcon, setUserIcon] = useState (<></>);
  const [admin, setAdmin] = useState(false);

  const isAdmin = async () => {
    let bool = await state.icfactory.methods.admins(state.account).call();
    setAdmin(bool);
  }

  useEffect(() => {
    window.addEventListener("load", function() {
      if (window.ethereum) {
        // detect Metamask account change
        window.ethereum.on('accountsChanged', function (accounts) {
          dispatch({ type: 'SET_ACCOUNT', payload: accounts[0] });
          console.log('account changed')
        });
    
         // detect Network account change
        window.ethereum.on('chainChanged', function(networkId){
          dispatch({ type: 'SET_NETID', payload: parseInt(networkId,16) });
        });
      } 
    });
    if(state.account && state.icfactory) { 
      setUserIcon(<Link to='/user'><BsPerson /></Link>)
      isAdmin();
    }
  },[state.account, state.netid, state.icfactory])

  return (
    <>
      <div className="header">
        <Navbar collapseOnSelect expand="lg" variant="dark" fixed="top">
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt={WEBSITE_NAME} className="header-logo-image" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto ml-30">
              {MENU_LINKS.map(ml => (
                <Nav.Link as={Link} to={ml.to}>{ml.name}</Nav.Link>
              ))}
              {admin && 
              <Nav.Link as={Link} to='/admin'>Admin</Nav.Link>}
            </Nav>
            <Nav>

            {state.netid == CD.NETWORK_ID && <IconContext.Provider value={{ color: "grey", size: '30px' }}>
              <div className='centering mr-25 mt-10'>
                {userIcon}
              </div>
            </IconContext.Provider>}
              <Button className='dark go-to-platform-button' onClick={ () => { window.location.href = 'http://agro.exm.gr:9090' }}>
                GO TO PLATFORM
              </Button>
            {state.account && state.netid != CD.NETWORK_ID &&
              <div className='pd-10 mr-25 text-light-red bold'>
                {wrongNetwork}
              </div>
            }
              <Login />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}

export default Header;