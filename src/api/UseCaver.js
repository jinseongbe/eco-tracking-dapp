import Caver from "caver-js";
import ECOTRACKING_ABI from "../abi/EcoTrackingABI.json";
import {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  CHAIN_ID,
  ECOTRACKING_CONTRACT_ADDRESS,
  PRIVATEKEY_CAVER,
} from "../constants";

const PRIVATEKEY = PRIVATEKEY_CAVER;

const option = {
  headers: [
    {
      name: "Authorization",
      value:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
    },
    {
      name: "x-chain-id",
      value: "8217",
    },
  ],
};

const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);

const EcoTrackingContract = new caver.contract(
  ECOTRACKING_ABI,
  ECOTRACKING_CONTRACT_ADDRESS
);

export const getUserCode = async (address) => {
  const usercode = await EcoTrackingContract.methods
    .getUserCode(address)
    .call();
  console.log(`getUserCode in caver.js, ${usercode}`);
  return usercode;
};

export const getUserCodeFromProduct_ = async (idx) => {
  const usercode = await EcoTrackingContract.methods
    .getUserCodeFromProduct(idx)
    .call();
  return usercode;
};

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((res) => {
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(res)
    );
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};

export const fetchProductsOf = async (address) => {
  const productIdx = await EcoTrackingContract.methods
    .getOwnedProduct(address)
    .call();
  console.log(`[numberOfProduct] : ${productIdx}`);

  const products = [];
  for (let i = 0; i < productIdx.length; i++) {
    const product = await EcoTrackingContract.methods
      .products(productIdx[i])
      .call();
    products.push(product);
  }
  return products;
};

export const fetchProductsAll = async () => {
  const productIdx = await EcoTrackingContract.methods
    .getAllProductNum()
    .call();
  console.log(`[numberOfProduct] : ${productIdx}`);

  const products = [];
  for (let i = 0; i < productIdx; i++) {
    const product = await EcoTrackingContract.methods.products(i).call();
    products.push(product);
  }
  return products;
};

export const getProductOwner = async (idx) => {
  const owners = await EcoTrackingContract.methods.getProductOwners(idx).call();
  const lastIdx = owners.length;
  console.log(`[owner] : ${owners[lastIdx - 1]}`);
  return owners[lastIdx - 1];
};

// 수정됨
export const changeUserCode = async (_address, _code) => {
  try {
    const privatekey = PRIVATEKEY;
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);
    console.log(`deployer.address : ${deployer.address}`);
    await EcoTrackingContract.methods.setUserCode(_address, _code).send({
      from: deployer.address,
      gas: "0x104000",
    });
    caver.wallet.remove(deployer.address);
    console.log(`change Usercode to ${_code}`);
  } catch (e) {
    console.log(`[ERROR_SET_USERCODE]${e}`);
  }
};

export const pickUpReq_ = async (idx) => {
  try {
    const privatekey = PRIVATEKEY;
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);
    await EcoTrackingContract.methods.pickupReqCheck(idx).send({
      from: deployer.address,
      gas: "0x104000",
    });
    console.log("pickup requested");
    caver.wallet.remove(deployer.address);
  } catch (e) {
    console.log(`[ERROR_PICKUP_REQUEST]${e}`);
  }
};

export const pickUpUnReq_ = async (idx) => {
  try {
    const privatekey = PRIVATEKEY;
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);

    await EcoTrackingContract.methods.pickupReqUnCheck(idx).send({
      from: deployer.address,
      gas: "0x104000",
    });
    caver.wallet.remove(deployer.address);
    console.log("pickup unrequested");
  } catch (e) {
    console.log(`[ERROR_PICKUP_REQUEST]${e}`);
  }
};

export const createProduct_ = async (
  _address,
  _serialNum,
  _manufacturer,
  _name,
  _dateOfManufacture,
  _itemCode
) => {
  try {
    const privatekey = PRIVATEKEY;
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);
    await EcoTrackingContract.methods
      .createProduct(
        _address,
        _serialNum,
        _manufacturer,
        _name,
        _dateOfManufacture,
        _itemCode
      )
      .send({
        from: deployer.address,
        gas: "0x104000",
      });
    caver.wallet.remove(deployer.address);
    console.log("product create");
  } catch (e) {
    console.log(`[ERROR_CREATEPRODUCT]${e}`);
  }
};

export const changeOwner_ = async (_productIdx, _to) => {
  try {
    const privatekey = PRIVATEKEY;
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);
    await EcoTrackingContract.methods.changeOwner(_productIdx, _to).send({
      from: deployer.address,
      gas: "0x104000",
    });
    caver.wallet.remove(deployer.address);
    console.log("product change owner");
  } catch (e) {
    console.log(`[ERROR_CREATEPRODUCT]${e}`);
  }
};

export const recycleReq_ = async (idx) => {
  try {
    const privatekey = PRIVATEKEY;
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    caver.wallet.add(deployer);
    await EcoTrackingContract.methods.recyleCheck(idx).send({
      from: deployer.address,
      gas: "0x104000",
    });
    console.log("recycle requested");
    caver.wallet.remove(deployer.address);
  } catch (e) {
    console.log(`[ERROR_RECYCLE_REQUEST]${e}`);
  }
};
