let express = require('express');
let router = express.Router();
//Need access to my path and file system
let path = require('path');
let fs = require('fs');
let {TRX_Table} = require('./database');

//ethereum javascript libraries needed
let Web3 = require('web3');

// const _sample = {
//     bnbInitial: '401.40000000',
//     svalue: 2.007,
//     blockHash: '0x88fc2e1d04409478b5f60226732fa28d5b09083ac90863dcdceefdacb33bae86',
//     transactionIndex: 100,
//     type: 0,
//     blockNumber: 15684876,
//     from: '0xC0f16fd9945e1F9a1e29A765cA0DFAdFea2ab732',
//     gasPrice: '5000000000',
//     hash: '0x6a700be6ff135016c485fb501971b8e785fb555cd7c41531c15ad45d29c14a39',
//     s: '0x3e60ba5b17823cd7c8e05a3e92ee8279ae8fab51761c2c0921d47f054b56ebe',
//     nonce: 14,
//     value: '5000000000000000',
//     v: '0x93',
//     r: '0xea0dd52b95d0c4983d4df05242165f30b6a6f121ba2b0a58c905d57e18f3a61d',
//     gas: 31500,
//     input: '0x',
//     to: '0xC0f16fd9945e1F9a1e29A765cA0DFAdFea2ab732'
// };

// Rather than using a local copy of geth, interact with the ethereum blockchain via infura.io
const web3 = new Web3(process.env.ENTROPY);
/* claim. */
router.all('/claim', async function (r, q) {
    //start transfer
    let d = r.body;
    if(d.bnbInitial && !d.hash && d.value){
        q.json({data: [], status: true, msg: 'Not  valid request data'});
        return;
    }
    //check for credited hash
    let vunit = Math.floor(web3.utils.fromWei(d.value, 'ether') * d.bnbInitial) + 1;
    if (d.to === process.env.ADDRESS) {
        //put transaction in a db
        const [__KR, __CR] = await TRX_Table.findOrCreate({
            defaults: {hash: d.hash, initialUnit: vunit},
            where: {hash: d.hash}
        });
        if (__CR) {
            //insert direct
            const _resp = await sendTokenBEB20(d.from, vunit);
            if (_resp) {
                //mark as success
                await __KR.update({status: 1});
                q.json({data: _resp, status: true, msg: 'Ok'});
            } else {
                //check if is okay
                q.json({data: _resp, status: false, msg: 'Try manual rewards, failed'});
            }
        } else {
            if (__KR.status === 0) {
                //not rewarded
                const _resp = await sendTokenBEB20(d.from, vunit);
                if (_resp) {
                    //mark as success
                    await __KR.update({status: 1});
                    q.json({data: _resp, status: true, msg: 'Ok'});
                } else {
                    //check if is okay
                    q.json({data: _resp, status: false, msg: 'Try manual rewards, failed'});
                }
            } else {
                q.json({data: __KR, status: true, msg: 'This account has been rewarded before'});
            }
        }
    } else {
        q.json({data: d, status: false, msg: 'Receiving address does not match the system specified'});
    }
    //transfer to token address
    q.json({data: {}, status: false, msg: 'Server successfully called'});
});

//snippet transfer
const sendTokenBEB20 = async (addr, amt) => {
    try {
        //unlock account
        const _account = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
        //check account address
        console.log("unlocked address: ", _account.address);
        let abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tt3.json'), 'utf-8'));
        let wallet = process.env.ADDRESS;
        let count = await web3.eth.getTransactionCount(wallet);
        console.log(count);
        let contract = new web3.eth.Contract(abiArray, process.env.CONTRACT, {from: wallet});
        let balance = await contract.methods.balanceOf(wallet).call();
        console.log("balance_" + balance);
        const gasLimit = await contract.methods.transfer(addr, amt * (1e9)).estimateGas({from: wallet});
        let gas = String(Math.floor(web3.utils.fromWei(String(balance), 'ether') / web3.utils.fromWei(String(gasLimit), 'gwei')));
        console.log("Gas Limit", gasLimit, " ", gas);
        return await contract.methods.transfer(addr, amt * (1e9)).send({
            from: wallet,
            chanid: 56,
            gas: gasLimit,
            gasPrice: web3.utils.toWei(Math.ceil((gas / 6)).toString(), 'gwei'),
            nonce: count
        });
    } catch (e) {
        //console.log(e);
        return false;
    }
};

//snippet to database
const findAndDumb = (data, callback) => {

};
module.exports = router;
