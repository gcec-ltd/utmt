'use strict';
const Crowdsale = artifacts.require('./UTMTCrowdsale.sol');
const UTMTToken = artifacts.require('./UTMT.sol');

contract('Crowdsale.js', accounts => {
    const admin = accounts[0];
    const user1 = accounts[1];
    const joysoWallet = accounts[4];
    let crowdsale,UTMTT; 

    beforeEach(async () => {
        UTMTT = await UTMTToken.new({ from: admin });
        crowdsale = await Crowdsale.new(joysoWallet, UTMTT.address,{ from: admin });

    });

    it("get rate", async () => {
       const rate = await crowdsale.rate.call();
       assert.equal(rate, 0);
    })

    it("get token", async () => {
       const token = await crowdsale.token.call();
       assert.equal(token, UTMTT.address);
    })

    it("get weiRaised", async () => {
       const weiRaised = await crowdsale.weiRaised.call();
       assert.equal(weiRaised, 0);
    })

    it("get wallet", async () => {
       const wallet = await crowdsale.wallet.call();
       assert.equal(wallet, joysoWallet);
    })

    it("buy token", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(crowdsale.address,100000000000,{from:admin});
       await crowdsale.updateEthPrice(1,{from:admin});
       await crowdsale.buyTokens(user1,{from:user1,value:10000000000});
       const balance2 = await UTMTT.balanceOf(user1);
       assert.equal(balance2 - balance1,1);
    })

    it("buy token by sending ether", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(crowdsale.address,100000000000,{from:admin});
       await crowdsale.updateEthPrice(1,{from:admin});
       await web3.eth.sendTransaction({from:user1,to:crowdsale.address,value:10000000000,gas:4700000})
       const balance2 = await UTMTT.balanceOf(user1);
       assert.equal(balance2 - balance1,1);
    })

    it("set rate", async () => {
       const rate1 = await crowdsale.rate.call();
       await crowdsale.updateEthPrice(1000,{from:admin});
       const rate2 = await crowdsale.rate.call();
       assert.equal(rate2 - rate1 ,1000);
    })

    it("buy token should fail when no token in crowdsale", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await crowdsale.updateEthPrice(1,{from:admin});
       
       try {
          await crowdsale.buyTokens(user1,{from:user1,value:10000000000});
          assert.fail('Expected revert not received');
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected 'revert', got ${error} instead`);
        }
    })

    it("buy token should fail when no price setting in crowdsale", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(crowdsale.address,100000000000,{from:admin});
    
       try {
          await crowdsale.buyTokens(user1,{from:user1,value:10000000000});
          assert.fail('Expected revert not received');
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected 'revert', got ${error} instead`);
        }
    })

    it("buy token should fail when no ether value in transaction", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(crowdsale.address,100000000000,{from:admin});
       await crowdsale.updateEthPrice(1,{from:admin});

       try {
          await crowdsale.buyTokens(user1,{from:user1,value:0});
          assert.fail('Expected revert not received');
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected 'revert', got ${error} instead`);
        }
    })

    it("buy token should fail when value is too small", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(crowdsale.address,100000000000,{from:admin});
       await crowdsale.updateEthPrice(1,{from:admin});

       try {
          await crowdsale.buyTokens(user1,{from:user1,value:10});
          assert.fail('Expected revert not received');
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected 'revert', got ${error} instead`);
        }
    })

    it("buy token should fail when token reciver is address 0", async () => {
       const balance1 = await UTMTT.balanceOf(user1);
       await UTMTT.transfer(crowdsale.address,100000000000,{from:admin});
       await crowdsale.updateEthPrice(1,{from:admin});

       try {
          await crowdsale.buyTokens('0x0000000000000000000000000000000000000000',{from:user1,value:10000000000});
          assert.fail('Expected revert not received');
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0;
          assert(revertFound, `Expected 'revert', got ${error} instead`);
        }
    })

});