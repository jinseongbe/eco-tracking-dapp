import styles from './SystemHome.module.css';
import { useState, useEffect, useMemo } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { ReactComponent as Logo } from '../img/ETLogo_light.svg';
import {getUserCodeFromProduct_, fetchProductsAll} from '../api/UseCaver';
import { IoMdArrowRoundForward } from 'react-icons/io';



export default function SystemHome() {
  const [testbool, setTestbool] = useState(true);
  const iconSize = 25;

  const [productUserCode, setProductUserCode] = useState(1);
  const [currentProductId, setCurrentProductId] = useState(0);

  const getUserCodeFromProduct = async (idx) => {
    const _userCode = await getUserCodeFromProduct_(idx);
    console.log(_userCode);
    setProductUserCode(_userCode);
    return _userCode;
  };

  const [productDetailIdx, setProductDetailIdx] = useState(0);
  const choiceProduct = (idx) => {
    setProductDetailIdx(idx);
    getUserCodeFromProduct(idx);
    setCurrentProductId(idx);
    fetchProducts();
    console.log(`choiceProduct ${idx}`);
  }

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const _products = await fetchProductsAll();
    setProducts(_products);
  };

  const forLoading =  () => {
    setTestbool(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  return (
    <div>
      <div className={styles.header}> 
        <div className={styles.logos}>      
          <Logo className={styles.logo} width="30" height="30"/>
          <div>EcoTracking</div>
        </div>
        <div className={styles.menu}>
          <div onClick={() => {forLoading(false)}}>제품 조회</div>
          <div>제품 통계</div>
          <div>사용자 추적</div>
        </div>
      </div>
      { testbool ? (
        <div className={styles.mainpage}> 
        <div>EcoTracking</div>
          
        </div>
      ) : (
        <div className={styles.mainContainer}>

          <div className={styles.contents}>
            <div className={styles.topBox}>
              <div>
                <div className={styles.titleTxt}>제품 정보</div>
                <div className={styles.detailBox}>
                  <div> 제품명 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {products[productDetailIdx].name} </div>
                  <div> 제조일자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {products[productDetailIdx].dateOfManufacture} </div>
                  <div> 제조사 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {products[productDetailIdx].manufacturer}</div>
                  <div> 시리얼 넘버 &nbsp;&nbsp;&nbsp;&nbsp;{products[productDetailIdx].serialNum}</div>
                </div>
              </div>
  
              <div>
                <div className={styles.titleTxt}>제품 검색 <input className={styles.input}></input></div>
                <div  className={styles.searchBox}>
                  <table className={styles.table}>
                    <thead align="center" bgcolor="white">
                      <th>제품 고유 번호</th>
                      <th>제품명</th>
                      <th>제조일자</th>
                      <th>제조사</th>
                      <th>시리얼 넘버</th>
                      <th>수거 요청</th>
                      <th>재활용 유무</th>
                      <th>조회하기</th>
                    </thead>
                    {products.map((product, index) => (
                      <tr align="center" bgcolor="white" key={index}>
                        <td>{product.registerNum}</td>
                        <td>{product.name}</td>
                        <td>{product.dateOfManufacture}</td>
                        <td>{product.manufacturer}</td>
                        <td>{product.serialNum}</td>
                        <td>{product.pickupReq ? "O" : "X"}</td>
                        <td>{product.recycled ? "O" : "X"}</td>
                        <div className={styles.btnProduct} onClick={() => {choiceProduct(product.registerNum)}}>조회</div>
                      </tr>
                    ))}
                  </table>
                  </div>
              </div>
            </div>
  
            <div className={styles.downBox}>
              <div className={styles.titleTxt}>{products[productDetailIdx].name}</div>
              <div className={styles.trackingContainer}>
                <div className = {productUserCode === "3" ? styles.trackingBox : styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>생산중</div>
                </div>
                <IoMdArrowRoundForward size = {iconSize}/>
                <div className = {styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>유통중</div>
                </div>
                <IoMdArrowRoundForward size = {iconSize}/>
                <div className = {productUserCode === "1" && !products[currentProductId].pickupReq ? styles.trackingBox : styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>사용중</div>
                </div>
                <IoMdArrowRoundForward size = {iconSize}/>
                <div className = {productUserCode === "1" && products[currentProductId].pickupReq ? styles.trackingBox : styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>수거 요청</div>
                </div>
                <IoMdArrowRoundForward size = {iconSize}/>
                <div className = {styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>수거 중</div>
                </div>
                <IoMdArrowRoundForward size = {iconSize}/>
                <div className = {productUserCode === "2" && !products[currentProductId].recycled ? styles.trackingBox : styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>수거 완료</div>
                </div>
                <IoMdArrowRoundForward size = {iconSize}/>
                <div className = {productUserCode === "2" && products[currentProductId].recycled ? styles.trackingBox : styles.trackingBoxDeActivate}>
                  <div className = {styles.processingTxt}>재활용 완료</div>
                </div> 
              </div> 
            </div>
  
          </div>
        </div>
      )}
 

    </div>

  )
}