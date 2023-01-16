import styles from './Data.module.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"

import {fetchProductsAll} from '../api/UseCaver';
const CONTRACT_ADDRESS = "0x5b827c64F65Ad6D0C6a30522245e982b411F10A8";

export default function Data({match}) {
  const params = useParams();
  const [idx, setIdx] = useState(0);
  const [products, setProducts] = useState([]);
  const [delay, setDelay] = useState(false);

  const fetchProducts = async () => {
    const _products = await fetchProductsAll();
    setProducts(_products);
    setDelay(true);
  };
  
  useEffect(() => {
    fetchProducts(CONTRACT_ADDRESS);
    setIdx(parseInt(params.id));  
    console.log(parseInt(params.id));
  }, [])


  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>    
        <div>제품명</div>
        <div>제품 고유 번호</div>
        <div>제조일자</div>
        <div>제조사</div>
        <div>시리얼 넘버</div>
      </div>
      
     {delay ? (
        <div className={styles.rightContainer}>
        <div>{products[idx].name}</div>
        <div>{products[idx].registerNum}</div>
        <div>{products[idx].dateOfManufacture}</div>
        <div>{products[idx].manufacturer}</div>
        <div>{products[idx].serialNum}</div>
      </div>) : null}
    </div>
    
  )
}