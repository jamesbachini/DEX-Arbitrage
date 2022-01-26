const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

let config,arb,owner,inTrade,balances;
const network = hre.network.name;
if (network === 'aurora') config = require('./../config/aurora.json');
if (network === 'fantom') config = require('./../config/fantom.json');

console.log(`Loaded ${config.routes.length} routes`);

const main = async () => {
  await setup();
  await loadData();
  await lookForDualTrade();
}

  const loadData = async () => {
    const tx = await arb.addStables(["0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB","0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d","0x4988a896b1227218e4A686fdE5EabdcAbd91571f","0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79","0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC","0xB12BFcA5A55806AaF64E99521918A4bf0fC40802"]);
    tx.wait();
    const tx2 = await arb.addTokens(["0x5ac53f985ea80c6af769b9272f35f122201d0f56","0x4e834cdcc911605227eedddb89fad336ab9dc00a","0x2BAe00C8BC1868a5F7a216E881Bae9e662630111","0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096","0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC","0x5C92A4A7f59A9484AFD79DbE251AD2380E589783","0x0fAD0ED848A7A16526E8a7574e418B015Dbf41B5","0x0f00576d07B594Bdc1caf44b6014A6A02E5AFd48","0xdc7acde9ff18b4d189010a21a44ce51ec874ea7c","0xb7e3617adb58dc34068522bd20cfe1660780b750","0x8bec47865ade3b172a928df8f990bc7f2a3b9f79","0x8973c9ec7b79fe880697cdbca744892682764c37","0xb59d0fdaf498182ff19c4e80c00ecfc4470926e2","0x2b9025aecc5ce7a8e6880d3e9c6e458927ecba04","0xe4baf0af161bf03434d1c5a53957981493c12c99","0xdeacf0faa2b80af41470003b5f6cd113d47b4dcd","0xabe9818c5fb5e751c4310be6f0f18c8d85f9bd7f","0x026dda7f0f0a2e42163c9c80d2a5b6958e35fc49","0xe3520349f477a5f6eb06107066048508498a291b","0xe301ed8c7630c9678c39e4e45193d1e7dfb914f7","0xea62791aa682d455614eaa2a12ba3d9a2fd197af","0xda2585430fef327ad8ee44af8f1f989a2a91a3d2","0xc8fdd32e0bf33f0396a18209188bb8c6fb8747d2","0x6454e4a4891c6b78a5a85304d34558dda5f3d6d8","0xE4eB03598f4DCAB740331fa432f4b85FF58AA97E","0x94190d8ef039c670c6d6b9990142e0ce2a1e3178","0xfca152a9916895bf564e3f26a611f9e1e6aa6e73","0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3","0xd126b48c072f4668e944a8895bc74044d5f2e85b","0x74974575d2f1668c63036d51ff48dbaa68e52408","0xC86Ca2BB9C9c9c9F140d832dE00BfA9e153FA1e3","0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d","0x6EBA841F1201fFDDe7DDC2ba995D3308f6C4aEa0","0x90eb16621274fb47a071001fbbf7550948874cb5","0x449f661c53aE0611a24c2883a910A563A7e42489","0x951cfdc9544b726872a8faf56792ef6704731aae","0x07b2055fbd17b601c780aeb3abf4c2b3a30c7aae","0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781","0x291c8fceaca3342b29cc36171deb98106f712c66","0x8828a5047d093f6354e3fe29ffcb2761300dc994","0x18921f1e257038e538ba24d49fa6495c8b1617bc","0xdc9be1ff012d3c6da818d136a3b2e5fdd4442f74","0x7821c773a12485b12a2b5b7bc451c3eb200986b1","0xFa94348467f64D5A457F75F8bc40495D33c65aBB","0x984c2505a14da732d7271416356f535953610340","0x1bc741235ec0ee86ad488fa49b69bb6c823ee7b7","0xb12bfca5a55806aaf64e99521918a4bf0fc40802","0x4988a896b1227218e4a686fde5eabdcabd91571f","0x098d5b6a26bca1d71f2335805d71b244f94e8a5f","0xf4eb217ba2454613b15dbdea6e5f22276410e89e","0xf34d508bac379825255cc80f66cbc89dfeff92e4","0x7ca1c28663b76cfde424a9494555b94846205585","0xa64514a8af3ff7366ad3d5daa5a548eefcef85e0","0xE9F226a228Eb58d408FdB94c3ED5A18AF6968fE1"]);
    tx2.wait();
    console.log('All done loading routes in to smart contract');
  }

  //function instaSearch(address _router, address _baseAsset, uint256 _amount) external view returns (uint256,address,address,address) {
  //function instaTrade(address _router1, address _token1, address _token2, address _token3, address _token4, uint256 _amount) external onlyOwner {

const lookForDualTrade = async () => {
  const router1 = config.routers[Math.floor(Math.random()*config.routers.length)].address;
  const baseAsset = config.baseAssets[Math.floor(Math.random()*config.baseAssets.length)].address;
  const tradeSize = balances[baseAsset].balance;
  try {
    const returnArray = await arb.instaSearch(router1, baseAsset, tradeSize);
    const amtBack = returnArray[0];
    const token2 = returnArray[1];
    const token3 = returnArray[2];
    const token4 = returnArray[4];
    const multiplier = ethers.BigNumber.from(config.minBasisPointsPerTrade+10000);
    const sizeMultiplied = tradeSize.mul(multiplier);
    const divider = ethers.BigNumber.from(10000);
    const profitTarget = sizeMultiplied.div(divider);
    if (amtBack.gt(profitTarget)) {
      await dualTrade(router1,baseAsset,token2,token3,token4,tradeSize);
    } else {
      await lookForDualTrade();
    }
  } catch (e) {
    console.log(e);
    await lookForDualTrade();	
  }
}

const dualTrade = async (router1,baseAsset,token2,token3,token4,tradeSize) => {
  if (inTrade === true) {
    await lookForDualTrade();	
    return false;
  }
  try {
    inTrade = true;
    console.log('> Making dualTrade...');
    const tx = await arb.connect(owner).instaTrade(router1,baseAsset,token2,token3,token4,tradeSize);
    await tx.wait();
    inTrade = false;
    await lookForDualTrade();
  } catch (e) {
    console.log(e);
    inTrade = false;
    await lookForDualTrade();
  }
}

const setup = async () => {
  [owner] = await ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  const IArb = await ethers.getContractFactory('InstaArb');
  arb = await IArb.attach(config.arbContract);
  balances = {};
  for (let i = 0; i < config.baseAssets.length; i++) {
    const asset = config.baseAssets[i];
    const interface = await ethers.getContractFactory('WETH9');
    const assetToken = await interface.attach(asset.address);
    const balance = await assetToken.balanceOf(config.arbContract);
    console.log(asset.sym, balance.toString());
    balances[asset.address] = { sym: asset.sym, balance, startBalance: balance };
  }
  setTimeout(() => {
    setInterval(() => {
      logResults();
    }, 600000);
    logResults();
  }, 120000);
}

const logResults = async () => {
  console.log(`############# LOGS #############`);
    for (let i = 0; i < config.baseAssets.length; i++) {
    const asset = config.baseAssets[i];
    const interface = await ethers.getContractFactory('WETH9');
    const assetToken = await interface.attach(asset.address);
    balances[asset.address].balance = await assetToken.balanceOf(config.arbContract);
    const diff = balances[asset.address].balance.sub(balances[asset.address].startBalance);
    const basisPoints = diff.mul(10000).div(balances[asset.address].startBalance);
    console.log(`#  ${asset.sym}: ${basisPoints.toString()}bps`);
  }
}

process.on('uncaughtException', function(err) {
  console.log('UnCaught Exception 83: ' + err);
  console.error(err.stack);
  fs.appendFile('./critical.txt', err.stack, function(){ });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: '+p+' - reason: '+reason);
});

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
