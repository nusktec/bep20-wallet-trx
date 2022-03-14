import React, {useState, useEffect} from "react";
import BtcChart from "../charts/btc";
import LtcChart from "../charts/ltc";
import XrpChart from "../charts/xrp";
import PageTitle from "../element/page-title";
import Header2 from "../layout/header2";
import Sidebar from "../layout/sidebar";
import {useMetaMask} from 'metamask-react';
import {toast} from "react-toastify";
import Web3 from 'web3';
import LoadingOverlay from 'react-loading-overlay';

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

//initial library
let web3 = new Web3('https://bsc-dataseed1.binance.org:443');

function Dashboard() {

    const __min = 10;
    const __bnb_address = '0x8666a9ef857561BA53B60501D27dccDa128163d6';

    const [fromToken, setFromToken] = useState('bnb');
    const [bnbCost, setBnbCost] = useState('0374.8');
    const [ethInitial, setEthInitial] = useState('27400.3');
    const [rptCost, setRptCost] = useState(0);
    const [usdCost, setUsdCost] = useState(0);
    const [bnbInitial, setBnbInitial] = useState(0);
    const [btnText, setBtnText] = useState('Exchange Now');
    const [btnText2, setBtnText2] = useState('Confirm Hash & Claim');
    const [hash2, setHash2] = useState('');
    const [trBool, setTrBool] = useState(false);
    const [loader, setLoader] = useState(false);
    const [trHash, setTrHash] = useState(false);

    const _alert = (msg) => toast(msg);

    //meta mask fuc
    const {account, chainId, connect, ethereum, status} = useMetaMask();

    useEffect(() => {
        rptTousd({target: {value: 10}});
        //update
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
            .then(response => response.json())
            .then(data => {
                setBnbInitial(data.price);
            });

        fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
            .then(response => response.json())
            .then(data => {
                setEthInitial(data.price);
            });

    }, []);

    const rptTousd = (e) => {
        try {
            let _val = parseInt(e.target.value);
            let _bnb = (_val / bnbInitial).toFixed(4);
            let _usd = _val;
            ///ass
            setRptCost(_val);
            setBnbCost(_bnb);
            setUsdCost(_usd);
        } catch (e) {
            //ignore
            console.log('error');
        }
    };

    //token function
    const _sendTokenRaw = (hash) => {
        web3.eth.getTransaction(hash).then(rs => {
            //prepare server token sending
            let _data = {bnbInitial, svalue: (web3.utils.fromWei(rs.value) * bnbInitial), ...rs};
            //sending to server
            setBtnText2('Verifying Hash...');
            fetch('https://exchange.rappietoken.com/trx/claim', {
                method: 'POST',
                body: JSON.stringify(_data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(rex => rex.json()).then(rx => {
                //place success and reward message here
                _alert('Copy RPT Contract address and paste it on your wallet...done');
                console.log(rx.data);
                setLoader(false);
                alert("You have successfully purchased (RPT), add contract address to your wallet to manage");
                setBtnText2('Confirm Hash & Claim');
            }).catch(e => {
                console.log(e);
                setLoader(false);
                _alert('Returned transaction...');
            })

        }).catch(e => {
            console.log(e);
            _alert('Error sending token, you can query it manually');
        });
    };

    const _change = (t) => {
        setFromToken(t.target.value);
    };

    const transferBuy = () => {
        if (rptCost < __min) {
            _alert('Unit too small for exchange, increase amount and try again');
            return;
        }
        if (fromToken !== 'bnb') {
            _alert('Token reversal propagating, try more bags in few time');
            return;
        }
        setBtnText('Please wait...');
        try {
            connect().then(async (acc) => {
                if (chainId === '0x38' || chainId === '56') {
                    //start transaction
                    ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                from: account,
                                to: __bnb_address,
                                value: web3.utils.toHex(web3.utils.toWei(bnbCost.toString(), 'ether')),
                                chainID: 0x38,
                            },
                        ],
                    }).then((txHash) => {
                        //successful
                        setTrBool(true);
                        setTrHash(txHash);
                        setBtnText('Swap Again');
                        _alert('Transaction confirmed, preparing token (RPT)');
                        _alert('Don\'t close this window... preparing token <1min.');
                        //send token
                        setLoader(true);
                        setTimeout(function () {
                            _sendTokenRaw(txHash);
                        }, 40000);
                    }).catch((error) => {
                        setBtnText('Exchange Now');
                        _alert(error.message);
                    });

                } else {
                    _alert('Switch to Smartchain network and try again');
                }
            }).catch((e) => {
                _alert('Failed to connect to SmartChain');
                console.log(e);
            })
            //window.web3 = new Web3('https://bsc-dataseed1.binance.org:443');
        } catch (e) {
            _alert('Error purchasing RPT');
        }
    };

    //confirm hash
    function confirmBuy() {
        //process already purchased
        setBtnText2('Please wait...');
        if (hash2.toString().length > 0) {
            _sendTokenRaw(hash2);
        } else {
            setBtnText2('Confirm Hash & Claim');
            _alert("Invalid hash or empty")
        }
    }

    return (
        <>
            <LoadingOverlay
                active={loader}
                spinner
                text='Preparing your token, please wait...'>
                <Header2/>
                <Sidebar/>
                <PageTitle/>
                <div className="content-body">
                    <div className="container-u">
                        <div className="row">
                            <div className="col-xl-8">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-12 col-xxl-4">
                                        <div className="card">
                                            <div className="card-header">
                                                <h4 className="card-title">Exchange</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="buy-sell-widget">
                                                    <div className="currency_validate">
                                                        <div className="mb-3">
                                                            <label className="me-sm-2">
                                                                Choose Asset
                                                            </label>
                                                            <div className="input-group mb-3">
                                                                <select value={'bnb'} onChange={_change} name="assets"
                                                                        className="form-control">
                                                                    <option value="bnb">
                                                                        Smartchain (BNB)
                                                                    </option>
                                                                    <option value="rpt">
                                                                        Rappie Token (RPT)
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="me-sm-2">
                                                                Token Type
                                                            </label>
                                                            <div className="input-group mb-3">
                                                                <select value={'rpt'} className="form-control"
                                                                        name="tk_type" onChange={() => {
                                                                }}>
                                                                    <option value="rpt">
                                                                        Rappie Token (RPT)
                                                                    </option>
                                                                    <option value="bnb">
                                                                        Smartchain (BNB)
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="me-sm-2">
                                                                Enter your amount
                                                            </label>
                                                            <div className="input-group">
                                                                <input
                                                                    min={10}
                                                                    value={rptCost}
                                                                    maxLength={11}
                                                                    onChange={(t) => rptTousd(t)}
                                                                    type="number"
                                                                    name="rpt_amount"
                                                                    className="form-control"
                                                                    placeholder="1 RPT"
                                                                />
                                                                <input
                                                                    value={bnbCost}
                                                                    disabled={true}
                                                                    type="number"
                                                                    name="rpt_amount"
                                                                    className="form-control"
                                                                    placeholder="0 BNB"
                                                                />
                                                                <input
                                                                    value={usdCost}
                                                                    maxLength={11}
                                                                    onChange={(t) => rptTousd(t)}
                                                                    type="number"
                                                                    name="usd_amount"
                                                                    className="form-control"
                                                                    placeholder="1 USD"
                                                                />
                                                            </div>
                                                            <p></p>
                                                        </div>
                                                        <button
                                                            onClick={() => transferBuy()}
                                                            type="submit"
                                                            name="submit"
                                                            className="btn btn-outline-secondary w-100">
                                                            {btnText}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-12 col-xxl-8">
                                        <div className="card">
                                            <div className="card-header">
                                                <h4 className="card-title">
                                                    Transaction{" "}
                                                </h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="transaction-widget">
                                                    <ul className="list-unstyled">
                                                        {(trHash) ? <li className="d-flex">
                                                        <span className="sold-thumb">
                                                            <i className="la la-arrow-circle-right"></i>
                                                        </span>
                                                            <div className="flex-grow-1" style={{overflow: 'hidden'}}>
                                                                <p>
                                                                    <small>
                                                                        {new Date().getUTCDate() + " " + monthNames[new Date().getUTCMonth()]},{" "},{" "}
                                                                        {new Date().getFullYear()}{" "}
                                                                    </small>
                                                                    <small>
                                                                        {new Date().getMinutes() + ":" + new Date().getHours()}
                                                                    </small>
                                                                </p>
                                                                <p className="wallet-address text-dark">
                                                                    <code>{trHash}</code>
                                                                </p>
                                                            </div>
                                                        </li> : ""}

                                                    </ul>
                                                </div>
                                            </div>


                                        </div>

                                        <div className="card">
                                            <div className="card-header">
                                                <h4 className="card-title">
                                                    Reclaim Transaction
                                                </h4>
                                            </div>

                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <label className="me-sm-2">
                                                        Enter your hash
                                                    </label>
                                                    <div className="input-group">
                                                        <input
                                                            value={hash2}
                                                            onChange={e => setHash2(e.target.value)}
                                                            id={'hash_'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Hash..."
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => confirmBuy()}
                                                    type="submit"
                                                    name="submit"
                                                    className="btn btn-outline-secondary w-100">
                                                    {btnText2}
                                                </button>
                                            </div>


                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-xxl-12">
                                        <div className="row">
                                            <div className="col-xl-3">
                                                <div className="widget-card">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="widget-stat">
                                                            <div className="coin-title">
                                                                <h5 className="d-inline-block ms-2 mb-3">
                                                                    Rappie Tokken (RPT)
                                                                </h5>
                                                            </div>
                                                            <h4>
                                                                USD {parseInt('1')}
                                                            </h4>
                                                        </div>
                                                        <LtcChart/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3">
                                                <div className="widget-card">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="widget-stat">
                                                            <div className="coin-title">
                                                                <h5 className="d-inline-block ms-2 mb-3">
                                                                    SmartChain (BNB)
                                                                </h5>
                                                            </div>
                                                            <h4>
                                                                USD {parseInt(bnbInitial)}
                                                            </h4>
                                                        </div>
                                                        <BtcChart/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3">
                                                <div className="widget-card">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="widget-stat">
                                                            <div className="coin-title">
                                                                <h5 className="d-inline-block ms-2 mb-3">
                                                                    Ethereum
                                                                </h5>
                                                            </div>
                                                            <h4>
                                                                USD {parseInt(ethInitial)}
                                                            </h4>
                                                        </div>
                                                        <LtcChart/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-3">
                                                <div className="widget-card">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="widget-stat">
                                                            <div className="coin-title">
                                                            <span>
                                                                <i className="cc USDT-alt"></i>
                                                            </span>
                                                                <h5 className="d-inline-block ms-2 mb-3">
                                                                    USDT Dollar
                                                                </h5>
                                                            </div>
                                                            <h4>
                                                                USD 1 {" "}
                                                            </h4>
                                                        </div>
                                                        <XrpChart/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </>
    );
}

export default Dashboard;
