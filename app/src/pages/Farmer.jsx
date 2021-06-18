import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CreateForm from "../components/farmer/CreateForm";
import ProductTable from "../components/heros/ProductTable";
import { PRODUCT_CARDS_CONTENT } from '../data/Data';

const Farmer = () => {
  let { product } = useParams();
  const [contains, setContains] = useState(false);

  useEffect(() => {
    let products = [];
    PRODUCT_CARDS_CONTENT.map(p => {
      products.push(p.icon);
    })
    setContains(products.includes(product))
  },[contains])

  if(!contains) 
    return(
      <div className='page-container'>
      <ProductTable />
    </div>
    );
  return (
    <div className='page-container'>
      <CreateForm product={product}/>
    </div>
  );
}

export default Farmer;