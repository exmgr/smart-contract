import React, {createContext, useReducer} from "react";
import Reducer from './Reducer';

const initialState = {
    init: false,
    web3: '',
    provider: '',
    netid: '',
    account: '',
    icfactory: '',
    erc20: '',
    modal: false,
    tx: '',
    value: '',
    product: '',
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;