import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import Dashboard from './jsx';
import {Lines, Circle} from 'react-preloaders';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {MetaMaskProvider} from "metamask-react";

function App() {
    return (
        <div className="App">
            <MetaMaskProvider>
                <Dashboard/>
                <Circle/>
                <ToastContainer theme={'dark'} position="top-center" autoClose={5000} hideProgressBar={false}
                                newestOnTop={false} closeOnClick={true}/>
            </MetaMaskProvider>
        </div>
    );
}

export default App;
