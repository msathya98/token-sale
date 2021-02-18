const { assert } = require("console");

var DappTokenSale = artifacts.require("./DappTokenSale.sol");

contract("DappTokenSale", function(accounts){
    var tokenSaleInstance;
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000;


    it("intializes the contact with the correct values", function() {
        return DappTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(address) {
            assert.notEqual(address, 0x0, "has contract address");
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address,0x0, 'has token contract address')
            return tokenSaleInstance.tokenPrice();
     }).then(function(price){
         assert.equal(price, tokenPrice, "token price is correct");

     });
    });

    it("facilitates token Buying ", function() {
        return DappTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
             var numberOfTokens = 10;
             var value = numberOfTokens * tokenPrice;
             return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value})
        }).then(function(receipt){
            return tokenSaleInstance.tokenSold();

        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, "increments the number of tokens sold");
        })
    })
});

