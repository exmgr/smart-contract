const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_INIT':
      return {
        ...state,
        init: action.payload
      }
    case 'SET_WEB3':
      return {
        ...state,
        web3: action.payload
      };
    case 'SET_PROVIDER':
      return {
        ...state,
        provider: action.payload
      };
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload
      };
    case 'SET_ICFACTORY':
      return {
        ...state,
        icfactory: action.payload
      };
    case 'SET_ERC20':
      return {
        ...state,
        erc20: action.payload
      };
    case 'SET_MODAL':
      return {
        ...state,
        modal: action.payload
      };
    case 'SET_TX':
      return {
        ...state,
        tx: action.payload
      };
    case 'SET_VALUE':
      return {
        ...state,
        value: action.payload
      };
    case 'SET_NETID':
      return {
        ...state,
        netid: action.payload
      };

    case 'SET_Product':
      return {
        ...state,
        product: action.payload
      };


    default:
      return state;
  }
};

export default Reducer;