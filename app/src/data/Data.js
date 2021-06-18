import welcome_img from './img/welcome.jpeg';
import contact_img from './img/contact.jpg';

export const WEBSITE_NAME = "AgroXM";

export const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
export const timeOptions = { hour: '2-digit', minute: '2-digit' }
export const dateLocale = 'de-DE'

export const wrongNetwork = 'Please connect to Kovan network.'
// do not change the to-path
export const MENU_LINKS = [
  { name: "Home", to: '/' },
  { name: "Statistics", to: "/statistics" },
  { name: 'Products', to: '/products' },
];

// data of the first hero of the landing page
export const WELCOME_IMG = welcome_img;
export const WELCOME_HEADING = "Eliminate crop risk with parametric weather insurance";
export const WELCOME_TEXT =
  <>
    <br />
    <ul>
      <li> Cheaper, faster, fair and transparent with zero paperwork</li>
      <li> No human assessment needed for claims, uses weather station data</li>
      <li> Pays out benefits automaticly based on predetermined index (e.g rainfall)</li>
      <li> Powered by blockchain technology ETHEREUM, CHAINLINK and IPFS</li>
    </ul>
    <br />
    <br />
    <br />

  </>
// general data of the product hero
export const PRODUCTS = {
  heading: 'Risk coverage products',
  text: 'Become resilient to climate change using blockchain\'s transparent, decentralized technology',
  buttonText: 'Let\'s start'
}
// product cards
// 4 cards in a row
// icons: rain, wind, snow, temp
// colors: green, orange, blue, red
// details: string array
export const PRODUCT_CARDS_CONTENT = [
  {
    icon: 'wind',
    color: 'blue',
    heading: 'High wind protection',
    active: true,
    details: [
      'Protect your crop against extreme wind in most sensitive periods'
    ]
  },

  {
    icon: 'rain',
    color: 'green',
    heading: 'Excess rain protection',
    active: false,
    details: [
      'Protect against too much rain during the most critical time of your crop.'
    ]
  },
  {
    icon: 'rain',
    color: 'orange',
    heading: 'Insufficient rain protection',
    active: false,
    details: [
      'Protects against lack of rainfall or drought during the most critical time of your crop.'
    ]
  },
]

// heading, description and field labels of the ocntract creation form (product form)
// cities: string array
export const PRODUCT_FORM = {
  heading: 'Selected risk coverage: ',
  text: {
    wind: 'Protect your crop against extreme wind in most sensitive periods',
    rain: 'At vero eos et accusam et justo duo dolores et ea rebum. At vero eos et accusam et justo duo dolores et ea rebum.',
    snow: 'At vero eos et accusam et justo duo dolores et ea rebum. At vero eos et accusam et justo duo dolores et ea rebum.',
    temp: 'At vero eos et accusam et justo duo dolores et ea rebum. At vero eos et accusam et justo duo dolores et ea rebum.',
  },
  location: 'Crop location:',
  crop: 'Crop value (ETH):',
  condition: 'Weather Condition:',
  period: 'Duration of risk protection (months):',
  threshold: {
    wind: 'Wind threshold (klm/h):',
    rain: 'Threshold:',
    snow: 'Threshold:',
    temp: 'Threshold:',
  },
  products: 'Weather data source:',
  ensure: 'Insurance premium:',
  cronPeriod: 'Execution period:',
  buttonText: 'Create Insurance',
  notConnected: 'Please connect to Kovan network.',
  cities: ["Agios Nikolaos", "Aleksandroypoli", "Amfissa", "Argostoli", "Arta", "Athens", "Beroia", "Bolos", "Drama", "Edessa", "Ermoypoli", "Florina", "Grebena", "Halkida", "Hania", "Hgoymenitsa", "Hrakleio", "Ioannina", "Kabala", "Kalamata", "Karditsa", "Karpenisi", "Kastoria", "Katerini", "Kerkyra", "Kilkis", "Komotini", "Korinthos", "Kozani", "Ksanthi", "Lamia", "Larissa", "Leivadia", "Leykada", "Mesologgi", "Mytilini", "Nayplion", "Patra", "Polygyros", "Prebeza", "Pyrgos", "Rethimno", "Rodos", "Samos", "Serres", "Sparti", "Thessaloniki", "Trikala", "Tripoli", "Xios", "Zakynthos"],
  cron:
  {
    title: 'Daily',
    dailyExecutions: 1
  },
  error: {
    general: 'Please fill in all marked fields correctly',
    crop: 'Insurance has not enough Ether',
    ensured: 'You have not enough ether balance',
    period: 'Insurance has not enough LINK',
    cron: 'Insurance has not enough LINK',
  }
}

export const SEND_PAGE = {
  heading_waiting: 'Waiting for wallet iteraction...',
  heading_pending: 'Pending...',
  heading_success: "Success",
  heading_error: 'Error',
  text: 'Creating your contract',
  message_error: 'Ooops, something went wrong..',
  message_waiting_before: '1. Please confirm the transaction in your wallet',
  message_waiting_after: '1. Transaction confirmed by user',
  message_transaction_before: '2. Waiting for transaction hash',
  message_transaction_after: '2. Transaction hash received: ',
  message_success_before: '3. Waiting for the transaction to be confirmed by the network',
  message_success_after: '3. Transaction confirmed by the network. See your contract details below:',
  heading_contract_details: 'New Contract:',
  button: {
    text: 'Go Back to Frontpage',
    to: '/',
  }
}

// heading, description and field labels of the statistics hero
export const FACTORY_OVERVIEW = {
  heading: 'Transparency on Insurance Contracts',
  text: "See transations and wallets",
  contractFactory: 'Insurance Contract Factory: ',
  link: 'LINK',
  eth: 'ETH',
  ensuredEth: 'Insured ETH',
  notEnsuredEth: 'Not Insured ETH'
}

// contact form hero
export const CONTACT_FORM = {
  img: contact_img,
  heading: 'Contact',
  text: 'Mail us because we are awesome. The contact form has atm no functionality.'
}

export const CONTRACT_TABLE = {
  heading: 'Your Contract Overview',
  text: 'This is an overview of your active and executed contracts.',
  table: {
    heading: 'Contracts',
    address: 'Contract: ',
    dateAdded: 'Date added: ',
    crop: 'Insured Crop: ',
    link: 'Link: ',
    products: 'Product(s): ',
    active: 'active',
    notActive: 'not active',
    details: {
      heading: 'Details',
      factory: 'Factory:',
      creator: 'Creator:',
      location: 'Location:',
      endDate: 'End Date:',
      weatherCon: 'Weather Condition:',
      threshold: 'Threshold:',
      max: 'Weather Condition Max:',
      min: 'Weather Condition Min:',
    },
    history: {
      heading: "History:",
      date: "Date: ",
      value: "Value: ",
      noData: "No Data"
    }
  }
}

export const ADMIN = {
  setEndDate: 'Set end date to NOW:',
  setEndDateButton: 'Send Tx',

}

// footer text
export const FOOTER = {
  text: <><p><a className='no-text-decoration' target="_blank" href="https://exm.gr/" >© EXM 2021 | Made with ❤️ in Greece | All Rights Reserved</a><br />Funded by NGI</p></>
}