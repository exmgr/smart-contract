import React from 'react';
import Contact from '../components/heros/Contact';
import ProductTable from '../components/heros/ProductTable';
import Statistics from '../components/heros/Statistics';
import Welcome from '../components/heros/Welcome';

const Home = () => {
  return (
    <div className='page-container'>
      <Welcome />
      <ProductTable />
      <Statistics />
    </div>
  );
}

export default Home;