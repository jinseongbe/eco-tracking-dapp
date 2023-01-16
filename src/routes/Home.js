import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as KlipAPI from "../api/UseKlip";
import QRCode from "qrcode.react";

import {
  fetchProductsOf,
  getBalance,
  getUserCodeFromProduct_,
  changeUserCode,
  getUserCode,
  pickUpReq_,
  pickUpUnReq_,
  createProduct_,
  changeOwner_,
  getProductOwner,
  recycleReq_,
} from "../api/UseCaver";
import { ECOTRACKING_CONTRACT_ADDRESS } from "../constants/index";

import { ReactComponent as Logo } from "../img/ETLogo_light.svg";
import { GoThreeBars } from "react-icons/go";
import { AiOutlineTablet, AiOutlineQrcode } from "react-icons/ai";
import { GiDigitalTrace } from "react-icons/gi";
import { FaRecycle } from "react-icons/fa";
import {
  CgSmartHomeRefrigerator,
  CgSmartHomeWashMachine,
  CgProfile,
} from "react-icons/cg";
import { MdMonitor } from "react-icons/md";
import { IoIosTv } from "react-icons/io";
import { BsLaptop } from "react-icons/bs";

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function Home() {
  // 수정전 변수들
  const [tab, setTab] = useState("FIRST"); // FIRST, SECOND, THIRD,
  const [tabColor1, setTabColor1] = useState("white"); // white, #4C8A57
  const [tabColor2, setTabColor2] = useState("#4C8A57"); // white, #4C8A57
  const [tabColor3, setTabColor3] = useState("#4C8A57"); // white, #4C8A57
  const [title, setTitle] = useState("내 제품"); // 내 제품, 제품 등록, 제품 추적

  const [productUserCode, setProductUserCode] = useState(1);
  const [currentProductId, setCurrentProductId] = useState(0);
  const handleSelect = (e) => {
    setCurrentProductId(e.target.value);
    getUserCodeFromProduct(e.target.value);
    // 없음:0. 소비자:1, 수거자:2, 생산자:3, 관리자: 4
  };

  const handleSelect_edit = (e) => {
    setCurrentProductId(e.target.value);
    getUserCodeFromProduct(e.target.value);
  };

  const [qrvalue, setQrvalue] = useState(QRCode.default);

  const [products, setProducts] = useState([]);
  const [balance, setBalance] = useState(0);
  // const [address, setAddress] = useState("0x5b827c64f65ad6d0c6a30522245e982b411f10a8");

  const [recycled, setRecycled] = useState(false);

  const [showDetail, setShowDetail] = useState(false);
  const [productDetailIdx, setProductDetailIdx] = useState(0);

  const [showTxtInput, setShowTxtInput] = useState(false);

  const [product_name, setProduct_name] = useState();
  const [product_manufacturer, setProduct_manufacturer] = useState();
  const [product_dateOfManufact, setProduct_dateOfManufact] = useState();
  const [product_itemCode, setProduct_itemCode] = useState();
  const [product_serialNum, setProduct_serialNum] = useState();

  const onChange_pn = (event) => {
    setProduct_name(event.target.value);
  };
  const onChange_pm = (event) => {
    setProduct_manufacturer(event.target.value);
  };
  const onChange_pd = (event) => {
    setProduct_dateOfManufact(parseInt(event.target.value));
  };
  const onChange_pi = (event) => {
    setProduct_itemCode(parseInt(event.target.value));
  };
  const onChange_ps = (event) => {
    setProduct_serialNum(event.target.value);
  };

  const [from, setFrom] = useState("0x00");

  const getProductOwner_ = async (idx) => {
    const _owner = await getProductOwner(idx);
    setFrom(_owner);
    fetchProducts(address);
    return _owner;
  };

  const iconColor = "#203F21";
  const iconSize = "35px";
  const productCodes = [
    <CgSmartHomeRefrigerator size={iconSize} color={iconColor} />,
    <MdMonitor size={iconSize} color={iconColor} />,
    <IoIosTv size={iconSize} color={iconColor} />,
    <BsLaptop size={iconSize} color={iconColor} />,
    <CgSmartHomeWashMachine size={iconSize} color={iconColor} />,
  ]; // 0:냉장고, 1:모니터, 2:티비, 3:노트북, 4:세탁기

  const [showSidebar, setShowSidebar] = useState(false);

  const fetchProducts = async (_address) => {
    const _products = await fetchProductsOf(_address);
    setProducts(_products);
  };

  const _getBalance = async (_address) => {
    const _balance = await getBalance(_address);
    setBalance(_balance);
  };

  const getUserCodeFromProduct = async (idx) => {
    const _userCode = await getUserCodeFromProduct_(idx);
    setProductUserCode(_userCode);
    return _userCode;
  };

  const getUserCode_ = async () => {
    const code = await getUserCode();
    changeUserCode(address, code);
    console.log(`get Usercode to ${code}`);
    return;
  };

  const pickUpRequest = async (idx) => {
    setShowDetail(false);
    await pickUpReq_(idx);
    fetchProducts(address);
    return;
  };

  const pickUpUnRequest = async (idx) => {
    setShowDetail(false);
    await pickUpUnReq_(idx);
    fetchProducts(address);
    return;
  };

  useEffect(() => {
    // setAddress(address);
    fetchProducts(address);
  }, []);

  // ------------------------ 수정하거나 새로 작성한 코드 ------------------------- //

  const [myBalance, setMyBalance] = useState(0);
  const [address, setMyAddress] = useState(DEFAULT_ADDRESS);
  const [userCode, setUserCode] = useState(-1);
  const [showQR, setShowQR] = useState(false);

  const getUserData = async () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
      const _userCode = await getUserCode(address);
      setUserCode(_userCode);
    });
    /* 아래는 나중에 지워야 본인 지갑으로 연동됨*/
    // const address = "0x5b827c64F65Ad6D0C6a30522245e982b411F10A8";
    // setMyAddress(address);
    // const _balance = await getBalance(address);
    // setMyBalance(_balance);
    // const _userCode = await getUserCode(address);
    // setUserCode(_userCode);

    setShowQR(true);
  };

  const changeUserCode_Re = async (address, code) => {
    await changeUserCode(address, code);
    const _balance = await getBalance(address);
    setMyBalance(_balance);
    const _userCode = await getUserCode(address);
    setUserCode(_userCode);
    fetchProducts(address);
    hideResigsterPage();
  };

  const [showRegister, setShowRegister] = useState(false);

  const showRegisterPage = async () => {
    setShowRegister(true);
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
      const _userCode = await getUserCode(address);
      setUserCode(_userCode);
    });
  };

  const hideResigsterPage = () => {
    setShowRegister(false);
  };

  const [productId, setProductId] = useState();
  const onChange = (event) => {
    setProductId(event.target.value);
    console.log(event.target.value);
  };

  const changeOwner = async (_productIdx) => {
    await changeOwner_(_productIdx, address);
    fetchProducts(address);
    return;
  };

  const recycleRequest = async (idx) => {
    await recycleReq_(idx);
    fetchProducts(address);
    return;
  };

  const createProduct = async (
    _address,
    _serialNum,
    _manufacturer,
    _name,
    _dateOfManufacture,
    _itemCode
  ) => {
    await createProduct_(
      _address,
      _serialNum,
      _manufacturer,
      _name,
      _dateOfManufacture,
      _itemCode
    );
    fetchProducts(address);
    return;
  };

  return (
    <div>
      {/* 로그인 페이지 */}
      {userCode === -1 ? (
        <div className={styles.loginBody}>
          <div className={styles.loginMainContainer}>
            <Logo width="78" height="78" />
            <div className={styles.txt1}>EcoTracking</div>
            {showQR ? (
              <QRCode
                value={qrvalue}
                size={100}
                bgColor="#7FBC7F"
                style={{ margin: "20px" }}
              ></QRCode>
            ) : null}
            <div
              style={{ textDecoration: "none" }}
              onClick={() => {
                getUserData();
              }}
            >
              <div className={styles.box}>로그인</div>
            </div>
            <div
              style={{ textDecoration: "none" }}
              onClick={() => {
                showRegisterPage();
              }}
            >
              <div className={styles.box}>등록</div>
            </div>
            <hr className={styles.LoginLine} />
            <Link style={{ textDecoration: "none" }} to="../system">
              <div className={styles.txt2}>관리자 모드</div>
            </Link>
          </div>
        </div>
      ) : null}

      {/* 등록페이지 */}
      {userCode === "0" ? (
        <div className={styles.registerBody}>
          <div className={styles.registerMainContainer}>
            <div
              onClick={() => {
                changeUserCode_Re(address, 1);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>사용자</div>
            </div>
            <div
              onClick={() => {
                changeUserCode_Re(address, 3);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>생산자</div>
            </div>
            <div
              onClick={() => {
                changeUserCode_Re(address, 2);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>수거자</div>
            </div>
            <div
              onClick={() => {
                changeUserCode_Re(address, 2);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>재활용 업체</div>
            </div>
            {/* <div onClick = {() => {setUserCode(4)}} style={{ textDecoration: 'none' }}>
            <div className={styles.registterBtn}>관리자</div>
          </div> */}
          </div>
        </div>
      ) : null}

      {/* 재등록 페이지*/}
      {showRegister ? (
        <div className={styles.registerBody}>
          <div className={styles.registerMainContainer}>
            <div
              onClick={() => {
                changeUserCode_Re(address, 1);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>사용자</div>
            </div>
            <div
              onClick={() => {
                changeUserCode_Re(address, 3);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>생산자</div>
            </div>
            <div
              onClick={() => {
                changeUserCode_Re(address, 2);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>수거자</div>
            </div>
            <div
              onClick={() => {
                changeUserCode_Re(address, 2);
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.registterBtn}>재활용 업체</div>
            </div>
            {/* <div onClick = {() => {setUserCode(4)}} style={{ textDecoration: 'none' }}>
            <div className={styles.registterBtn}>관리자</div>
          </div> */}
          </div>
        </div>
      ) : null}

      {/* 지갑 사이드바 */}
      {showSidebar ? (
        <div className={styles.sidebarContainer}>
          <div
            onClick={() => {
              setShowSidebar(false);
            }}
            className={styles.sidebarBackground}
          ></div>
          <div className={styles.detailSidebar}>
            <div className={styles.detailSidebarHeader}>
              <CgProfile size="35px" color="#203F21" />
              <div className={styles.detailSidebarTxt}>내 정보</div>
            </div>
            <div className={styles.walletContainer}>
              <div className={styles.detailSidebarTxt2}> 내 지갑 주소</div>
              <div className={styles.detailSidebarTxt3}> {address}</div>
              <div className={styles.detailSidebarTxt2}> 잔액 </div>
              <div className={styles.detailSidebarTxt3}> {myBalance} klay</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 소비자 */}
      {userCode === "1" && (
        <div>
          {showDetail ? (
            <div className={styles.modalContainer}>
              <div
                onClick={() => {
                  setShowDetail(false);
                }}
                className={styles.background}
              ></div>
              <div className={styles.detailModal}>
                <div className={styles.detailTxtCondtainer}>
                  <div>
                    {" "}
                    제품명 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].name}{" "}
                  </div>
                  <div>
                    {" "}
                    제조일자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].dateOfManufacture}{" "}
                  </div>
                  <div>
                    {" "}
                    제조사 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].manufacturer}
                  </div>
                  <div>
                    {" "}
                    시리얼 넘버 &nbsp;{products[productDetailIdx].serialNum}
                  </div>
                </div>
                <div className={styles.modalBtnContainer}>
                  <div
                    className={styles.modalBtn}
                    onClick={() => {
                      pickUpRequest(products[productDetailIdx].registerNum);
                    }}
                  >
                    {" "}
                    수거 요청{" "}
                  </div>
                  <div
                    className={styles.modalBtn}
                    onClick={() => {
                      pickUpUnRequest(products[productDetailIdx].registerNum);
                    }}
                  >
                    {" "}
                    수거 철회{" "}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={styles.header}>
            <div onClick={() => {}} className={styles.icon}>
              <GoThreeBars
                size="30px"
                color="#203F21"
                onClick={() => {
                  setShowSidebar(true);
                }}
              />
              <div className={styles.title}> {title} </div>
            </div>
          </div>

          <div className={styles.mainContainer}>
            <div className={styles.contents}>
              {tab === "FIRST" ? (
                <div className={styles.firstScene}>
                  {products.map((product, index) => (
                    <div
                      onClick={() => {
                        setShowDetail(true);
                        setProductDetailIdx(index);
                      }}
                      className={styles.products}
                      key={index}
                    >
                      {productCodes[product.itemCode]}
                      <div className={styles.productName}>{product.name}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {tab === "SECOND" ? (
                <div className={styles.secondScene}>
                  <div className={styles.qrCamBox}></div>
                  <div className={styles.lineContainer}>
                    <hr className={styles.line}></hr>
                    <div className={styles.orTxt}>or</div>
                    <hr className={styles.line}></hr>
                  </div>
                  <div
                    className={styles.txtInput}
                    onClick={() => {
                      setShowTxtInput(true);
                    }}
                  >
                    {" "}
                    직접입력{" "}
                  </div>
                  {showTxtInput ? (
                    <div className={styles.inputContainer}>
                      <input
                        className={styles.productInput}
                        placeholder=" product id number"
                        type="number"
                        onChange={onChange}
                      />
                      <div
                        className={styles.changeBtn}
                        onClick={() => {
                          changeOwner(productId, address);
                          console.log("등록 클릭");
                        }}
                      >
                        등록
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {tab === "THIRD" ? (
                <div className={styles.thirdScene}>
                  <div className={styles.trackingContainer}>
                    <div className={styles.selectTxt}>제품 선택</div>
                    <select
                      className={styles.selectBox}
                      onChange={handleSelect}
                      val={products[0].registerNum}
                    >
                      {products.map((product, index) => (
                        <option
                          key={index}
                          className={styles.selectOption}
                          value={product.registerNum}
                        >
                          &nbsp;{product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className={
                      productUserCode === "1" &&
                      !products[currentProductId].pickupReq
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>사용중</div>
                  </div>
                  <div
                    className={
                      productUserCode === "1" &&
                      products[currentProductId].pickupReq
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>수거 요청</div>
                  </div>
                  <div
                    className={
                      productUserCode === "2" &&
                      !products[currentProductId].recycled
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>
                      수거 및 재활용 센터 처리중
                    </div>
                  </div>
                  <div
                    className={
                      productUserCode === "2" &&
                      products[currentProductId].recycled
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>재활용 완료</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.tabBar}>
            <div
              onClick={() => {
                setTab("FIRST");
                setTabColor1("white");
                setTabColor2("#4C8A57");
                setTabColor3("#4C8A57");
                setTitle("내 제품");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <AiOutlineTablet size="30px" color={tabColor1} />{" "}
              </div>
            </div>

            <div
              onClick={() => {
                setTab("SECOND");
                setTabColor1("#4C8A57");
                setTabColor2("white");
                setTabColor3("#4C8A57");
                setTitle("제품 등록");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <AiOutlineQrcode size="30px" color={tabColor2} />{" "}
              </div>
            </div>

            <div
              onClick={() => {
                setTab("THIRD");
                setTabColor1("#4C8A57");
                setTabColor2("#4C8A57");
                setTabColor3("white");
                setTitle("제품 추적");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <GiDigitalTrace size="30px" color={tabColor3} />{" "}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 수거자 & 재활용 */}
      {userCode === "2" && (
        <div>
          {showDetail ? (
            <div className={styles.modalContainer}>
              <div
                onClick={() => {
                  setShowDetail(false);
                }}
                className={styles.background}
              ></div>
              <div className={styles.detailModal_edit}>
                <div className={styles.detailTxtCondtainer_edit}>
                  <div>
                    {" "}
                    제품명 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].name}{" "}
                  </div>
                  <div>
                    {" "}
                    제조일자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].dateOfManufacture}{" "}
                  </div>
                  <div>
                    {" "}
                    제조사 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].manufacturer}
                  </div>
                  <div>
                    {" "}
                    시리얼 넘버 &nbsp;{products[productDetailIdx].serialNum}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={styles.header}>
            <div onClick={() => {}} className={styles.icon}>
              <GoThreeBars
                size="30px"
                color="#203F21"
                onClick={() => {
                  setShowSidebar(true);
                }}
              />
              <div className={styles.title}> {title} </div>
            </div>
          </div>

          <div className={styles.mainContainer}>
            <div className={styles.contents}>
              {tab === "FIRST" ? (
                <div className={styles.firstScene}>
                  {products.map((product, index) => (
                    <div
                      onClick={() => {
                        setShowDetail(true);
                        setProductDetailIdx(index);
                      }}
                      className={styles.products}
                      key={index}
                    >
                      {productCodes[product.itemCode]}
                      <div className={styles.productName}>{product.name}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {tab === "SECOND" ? (
                <div className={styles.secondScene}>
                  <div className={styles.qrCamBox}></div>
                  <div className={styles.lineContainer}>
                    <hr className={styles.line}></hr>
                    <div className={styles.orTxt}>or</div>
                    <hr className={styles.line}></hr>
                  </div>
                  <div
                    className={styles.txtInput}
                    onClick={() => {
                      setShowTxtInput(true);
                    }}
                  >
                    {" "}
                    직접입력{" "}
                  </div>
                  {showTxtInput ? (
                    <div className={styles.inputContainer}>
                      <input
                        className={styles.productInput}
                        placeholder=" product id number"
                        type="number"
                        onChange={onChange}
                      />
                      <div
                        className={styles.changeBtn}
                        onClick={() => {
                          changeOwner(productId, address);
                          console.log("수거 클릭");
                        }}
                      >
                        수거
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {tab === "THIRD" ? (
                <div className={styles.secondScene}>
                  <div className={styles.qrCamBox}></div>
                  <div className={styles.lineContainer}>
                    <hr className={styles.line}></hr>
                    <div className={styles.orTxt}>or</div>
                    <hr className={styles.line}></hr>
                  </div>
                  <div
                    className={styles.txtInput}
                    onClick={() => {
                      setShowTxtInput(true);
                    }}
                  >
                    {" "}
                    직접입력{" "}
                  </div>
                  {showTxtInput ? (
                    <div className={styles.inputContainer}>
                      <input
                        className={styles.productInput}
                        placeholder=" product id number"
                        type="number"
                        onChange={onChange}
                      />
                      <div
                        className={styles.changeBtn}
                        onClick={() => {
                          recycleRequest(productId);
                          console.log("재활용 처리 클릭");
                        }}
                      >
                        재활용
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.tabBar}>
            <div
              onClick={() => {
                setTab("FIRST");
                setTabColor1("white");
                setTabColor2("#4C8A57");
                setTabColor3("#4C8A57");
                setTitle("수거 제품");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <AiOutlineTablet size="30px" color={tabColor1} />{" "}
              </div>
            </div>

            <div
              onClick={() => {
                setTab("SECOND");
                setTabColor1("#4C8A57");
                setTabColor2("white");
                setTabColor3("#4C8A57");
                setTitle("제품 수거");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <AiOutlineQrcode size="30px" color={tabColor2} />{" "}
              </div>
            </div>

            <div
              onClick={() => {
                setTab("THIRD");
                setTabColor1("#4C8A57");
                setTabColor2("#4C8A57");
                setTabColor3("white");
                setTitle("재활용 처리");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <FaRecycle size="30px" color={tabColor3} />{" "}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 생산자 */}
      {userCode === "3" && (
        <div>
          {showDetail ? (
            <div className={styles.modalContainer}>
              <div
                onClick={() => {
                  setShowDetail(false);
                }}
                className={styles.background}
              ></div>
              <div className={styles.detailModal_edit}>
                <div className={styles.detailTxtCondtainer_edit}>
                  <div>
                    {" "}
                    제품명
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].name}{" "}
                  </div>
                  <div>
                    {" "}
                    제조일자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].dateOfManufacturer}{" "}
                  </div>
                  <div>
                    {" "}
                    제조사
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {products[productDetailIdx].manufacturer}
                  </div>
                  <div>
                    {" "}
                    시리얼 넘버 &nbsp;&nbsp;&nbsp;&nbsp;
                    {products[productDetailIdx].serialNum}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={styles.header}>
            <div className={styles.icon}>
              <GoThreeBars
                size="30px"
                color="#203F21"
                onClick={() => {
                  setShowSidebar(true);
                }}
              />
              <div className={styles.title}> {title} </div>
            </div>
          </div>

          <div className={styles.mainContainer}>
            <div className={styles.contents}>
              {tab === "FIRST" ? (
                <div className={styles.firstScene}>
                  {products.map((product, index) => (
                    <div
                      onClick={() => {
                        setShowDetail(true);
                        setProductDetailIdx(index);
                      }}
                      className={styles.products}
                      key={index}
                    >
                      {productCodes[Number(product.itemCode)]}
                      <div className={styles.productName}>{product.name}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {tab === "SECOND" ? (
                <div className={styles.secondScene}>
                  <div className={styles.prodRegInputContainer}>
                    <div className={styles.prodRegInputTxt}>
                      <div>제품명</div>
                      <input
                        className={styles.prodRegiInput}
                        value={product_name}
                        placeholder=" 영문,한글 입력"
                        type="text"
                        onChange={onChange_pn}
                      />
                    </div>
                    <div className={styles.prodRegInputTxt}>
                      <div>제조사</div>
                      <input
                        className={styles.prodRegiInput}
                        value={product_manufacturer}
                        placeholder=" 영문,한글 입력"
                        type="text"
                        onChange={onChange_pm}
                      />
                    </div>
                    <div className={styles.prodRegInputTxt}>
                      <div>제조일자</div>
                      <input
                        className={styles.prodRegiInput}
                        value={product_dateOfManufact}
                        placeholder=" YYYYMMDD 숫자만 입력"
                        type="number"
                        onChange={onChange_pd}
                      />
                    </div>
                    <div className={styles.prodRegInputTxt}>
                      <div>제품코드</div>
                      <input
                        className={styles.prodRegiInput}
                        value={product_itemCode}
                        placeholder=" 숫자만 입력"
                        type="number"
                        onChange={onChange_pi}
                      />
                    </div>
                    <div className={styles.prodRegInputTxt}>
                      <div>시리얼 번호</div>
                      <input
                        className={styles.prodRegiInput}
                        value={product_serialNum}
                        placeholder=" 영문,한글 입력"
                        type="text"
                        onChange={onChange_ps}
                      />
                    </div>
                  </div>
                  <div
                    className={styles.prodRegisterBtn}
                    onClick={() => {
                      createProduct(
                        address,
                        product_serialNum,
                        product_manufacturer,
                        product_name,
                        product_dateOfManufact,
                        product_itemCode
                      );
                    }}
                  >
                    등록
                  </div>
                </div>
              ) : null}
              {tab === "THIRD" ? (
                <div className={styles.thirdScene}>
                  <div className={styles.trackingContainer}>
                    <div className={styles.selectTxt}>제품 선택</div>
                    <select
                      className={styles.selectBox}
                      onChange={handleSelect_edit}
                      val={products[0].registerNum}
                    >
                      {products.map((product, index) => (
                        <option
                          key={index}
                          className={styles.selectOption}
                          value={product.registerNum}
                        >
                          &nbsp;{product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className={
                      productUserCode === "3"
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>판매중</div>
                  </div>
                  <div
                    className={
                      productUserCode === "1"
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>판매 완료</div>
                  </div>
                  <div
                    className={
                      productUserCode === "2" &&
                      !products[currentProductId].recycled
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>사용 완료</div>
                  </div>
                  <div
                    className={
                      productUserCode === "2" &&
                      products[currentProductId].recycled
                        ? styles.trackingBox
                        : styles.trackingBoxDeActivate
                    }
                  >
                    <div className={styles.processingTxt}>재활용 완료</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.tabBar}>
            <div
              onClick={() => {
                setTab("FIRST");
                setTabColor1("white");
                setTabColor2("#4C8A57");
                setTabColor3("#4C8A57");
                setTitle("생산 제품");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <AiOutlineTablet size="30px" color={tabColor1} />{" "}
              </div>
            </div>

            <div
              onClick={() => {
                setTab("SECOND");
                setTabColor1("#4C8A57");
                setTabColor2("white");
                setTabColor3("#4C8A57");
                setTitle("생산 제품 등록");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <AiOutlineQrcode size="30px" color={tabColor2} />{" "}
              </div>
            </div>

            <div
              onClick={() => {
                setTab("THIRD");
                setTabColor1("#4C8A57");
                setTabColor2("#4C8A57");
                setTabColor3("white");
                setTitle("제품 추적");
              }}
              className="row d-flex-column justify-content-center align-items-center"
            >
              <div>
                {" "}
                <GiDigitalTrace size="30px" color={tabColor3} />{" "}
              </div>
            </div>
          </div>
        </div>
      )}

      {userCode === "4" && (
        <div>
          관리자 페이지는 모바일을 지원하지 않습니다. PC로 접속해 주세요.
        </div>
      )}
    </div>
  );
}
