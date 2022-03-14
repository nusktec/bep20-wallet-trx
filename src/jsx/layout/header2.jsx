import React, {useEffect, useState} from 'react';
import {DropdownButton} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {toast} from "react-toastify";
import {useMetaMask} from "metamask-react";

function Header2() {

    const _alert = (msg) => toast(msg);

    //meta mask fuc
    const {account, chainId, connect, ethereum, status} = useMetaMask();

    const [_btnConnect, _setBtnConnect] = useState('Connect Wallet');

    useEffect(() => {
        let _acc =  window.localStorage.getItem('account');
        if(_acc){
            let _cutAcc = _acc.substr(0, 16) + "...";
            _setBtnConnect(_cutAcc);
        }
    }, [status]);

    //connect button
    const _connectFunc = () => {
        if(status==="disconnected"){
            localStorage.clear();
        }
        _setBtnConnect('Connecting...');
        connect().then(r => {
            if (r.length > 0) {
                window.localStorage.setItem('account', r[0]);
                let _acc = r[0];
                let _cutAcc = _acc.substr(0, 16) + "...";
                _setBtnConnect(_cutAcc);
                window.location.reload();
            } else {
                _setBtnConnect('Re-connect Wallet');
            }
        }).catch(e => {
            _setBtnConnect('Re-connected');
        });
    };

    return (
        <>
            <div className="header dashboard">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            <nav className="navbar navbar-expand-lg navbar-light px-0 justify-content-between">
                                {/* <Link className="navbar-brand" to={'/'}><img src={require('./../../images/logo.png')} alt="" /></Link> */}
                                <div className="header-search d-flex align-items-center">
                                    <Link to={''} className="brand-logo me-3" href="">
                                        <img src={require('./../../images/logo.jpg')} alt="" width="30"/>
                                    </Link>
                                    <div className="input-group">
                                        <input type="text" className="form-control"
                                               value={'0xef6d440a96A5d384315114F0994a060A17802B3b'}
                                               placeholder="contract address: "/>
                                        <div onClick={()=>{
                                            navigator.clipboard.writeText("0xef6d440a96A5d384315114F0994a060A17802B3b");
                                        }} style={{cursor: 'pointer'}} className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-copy"></i></span>
                                        </div>
                                        <div style='cursor: pointer' onClick={_connectFunc}
                                             style={{cursor: 'pointer', marginLeft: 10}} className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-link"></i></span>
                                        </div>
                                    </div>
                                </div>s

                                <div className="dashboard_log my-2">
                                    <div className="d-flex align-items-center d-none d-lg-block">
                                        <button
                                            onClick={() => _connectFunc()}
                                            type="submit"
                                            name="submit"
                                            className="btn btn-success w-100">
                                            {_btnConnect}
                                        </button>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header2;