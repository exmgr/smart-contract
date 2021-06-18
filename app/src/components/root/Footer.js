import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../utils/Store';
import TxModal from '../modals/TxModal';
import { FOOTER } from '../../data/Data'

const Footer = () => {
  const [state, dispatch] = useContext(Context)

  useEffect(() => {

  }, [state.modal]);

  return (
    <>
      {state.modal && <TxModal />}
      <div className="footer centering pd-30 small-text text-darker">
        {FOOTER.text}
      </div>
    </>
  );
}

export default Footer;