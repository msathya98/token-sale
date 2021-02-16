const { assert } = require("console");

var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts) 
{
    var tokenInstance;
 it("intializes the contract with the correct values", function() {
   return DappToken.deployed().then(function(instance){
     tokenInstance = instance;
     return tokenInstance.name();

   }).then(function(name) {
     assert.equal(name, "DApp Token", "has the correct name");
     return tokenInstance.symbol();
   }).then(function(symbol){
     assert.equal(symbol, "DAPP", "has the correct symbol");

   }).then(function(standard){
     assert.equal(standard, "DAPP token v1.0", "has the correct standard");
   });
 })


  it('allocates the initial supply upon deployment', function() 
  {
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);

    }).then(function(adminBalance){
        assert.equal(adminBalance.toNumber(), 1000000, "it allocates the initial supply to the admin")
    });
  });

  it("transfer token ownership", function() {
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;

      return tokenInstance.transfer.call(accounts[1], 99999999999999999999);

    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return tokenInstance.transfer(accounts[1], 25000, { from: accounts[0] } );

    }).then(function(receipt) {
      return tokenInstance.balanceOf(accounts[1]); 
    }).then(function(balance){
      assert.equal(balance.toNumberO(), 2500000, "adds the amount to the recieving account");
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 7500000, "deduct the amount from the sending account")
    })
  })
})
