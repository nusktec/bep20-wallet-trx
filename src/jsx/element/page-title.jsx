import React, {useEffect, useState} from 'react';

function PageTitle() {

    const [addr, setAddr] = useState('Please connect wallet');

    useEffect(()=>{
        setAddr((window.localStorage.getItem('account'))?window.localStorage.getItem('account'): 'Please connect wallet');
    }, []);

    return (
        <>
            <div className="page_title">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            Wallet Address: {addr}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PageTitle;