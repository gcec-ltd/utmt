'use strict';
const UTMTToken = artifacts.require('./UTMT.sol');
contract('Crowdsale.js', accounts => {
    const admin = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    let UTMTT;
    beforeEach(async () => {
        UTMTT = await UTMTToken.new({ from: admin });
    });

    it("total supply", async () => {
       const totalSupply = await UTMTT.totalSupply.call();
       assert.equal(totalSupply, 100000000000000000);
    })

    it("balance of", async () => {
       const balance = await UTMTT.balanceOf(admin);
       assert.equal(balance, 100000000000000000);
    })

    it("balance of", async () => {
       const balance = await UTMTT.balanceOf(admin);
       assert.equal(balance, 100000000000000000);
    })

    it("transfer", async () => {
       const adminBalance1 = await UTMTT.balanceOf(admin);
       const user1Balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(user1,100000);
       const adminBalance2 = await UTMTT.balanceOf(admin);
       const user1Balance2 = await UTMTT.balanceOf(user1);
       assert.equal(adminBalance1 - adminBalance2, 100000);
       assert.equal(user1Balance2 - user1Balance1, 100000);
    })

    it("transfer from", async () => {
       const adminBalance1 = await UTMTT.balanceOf(admin);
       const user1Balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.approve(user1,100000,{from:admin});
       await UTMTT.transferFrom(admin,user1,100000,{from:user1});
       const adminBalance2 = await UTMTT.balanceOf(admin);
       const user1Balance2 = await UTMTT.balanceOf(user1);
       assert.equal(adminBalance1 - adminBalance2, 100000);
       assert.equal(user1Balance2 - user1Balance1, 100000);
    })

});