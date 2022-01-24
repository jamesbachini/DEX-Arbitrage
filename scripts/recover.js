const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const arbContract = process.env.arbContract;

const baseAssets = {
	weth: {
		sym: 'weth',
		address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
	},
	wnear: {
		sym: 'wnear',
		address: '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d',
	},
	usdt: {
		sym: 'usdt',
		address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
	},
	aurora: {
		sym: 'aurora',
		address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
	},
	atust: {
		sym: 'atust',
		address: '0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC',
	},
	usdc: {
		sym: 'usdc',
		address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
	},
};

let arb,owner;

const main = async () => {
  [owner] = await ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  const IArb = await ethers.getContractFactory('Arb');
  arb = await IArb.attach(arbContract);
  for (let i = 0; i < Object.keys(baseAssets).length; i++) {
    const sym = Object.keys(baseAssets)[i];
    let balance = await arb.getBalance(baseAssets[sym].address);
    console.log(`${sym} Start Balance: `,balance.toString());
    await arb.connect(owner).recoverTokens(baseAssets[sym].address);
    balance = await arb.getBalance(baseAssets[sym].address);
    await new Promise(r => setTimeout(r, 2000));
    console.log(`${sym} Close Balance: `,balance.toString());
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
