import React from 'react';
import { Link } from 'react-router-dom';



function Sidebar() {

    return (
        <>
            <div className="sidebar">
                <Link className="brand-logo" to={"/exchange"}>
                    <img style={{width:  100}} src={'https://rappietoken.com/wp-content/uploads/2021/11/rappie-logo.png'} alt="" />
                    <span>Rappie Token</span>
                </Link>
                <div className="menu">
                    <ul>
                        <li>
                            <Link to={"/exchange"}>
                                <span><i className="mdi mdi-repeat"></i></span>
                                <span className="nav-text">Exchange</span>
                            </Link>
                        </li>
                        <li><Link target={'_blank'} to={"https://rappietoken.com/"}>
                            <span><i className="mdi mdi-web"></i></span>
                            <span className="nav-text">Official Webpage</span>
                        </Link>
                        </li>
                    </ul>
                </div>
                <div className="sidebar-footer">
                    <div className="social">
                        <Link target={'_blank'} to={"https://www.instagram.com/rappietoken"}><i className="fa fa-instagram"></i></Link>
                        <Link target={'_blank'} to={"https://twitter.com/rappietoken"}><i className="fa fa-twitter"></i></Link>
                        <Link target={'_blank'} to={"https://www.instagram.com/rappietoken"}><i className="fa fa-facebook"></i></Link>
                    </div>
                    <div className="copy_right">
                        © {new Date().getFullYear()} - Rappie Team
                </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;