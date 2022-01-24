const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const arbContract = process.env.arbContract;

const baseAssets = {
	weth: {
		sym: 'weth',
		address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
		initialFunding: ethers.BigNumber.from('10000000000000000'), // 0.01 ETH
	},
	wnear: {
		sym: 'wnear',
		address: '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d',
		initialFunding: ethers.BigNumber.from('1000000000000000000000000'), // 1 NEAR
	},
	usdt: {
		sym: 'usdt',
		address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
		initialFunding: ethers.BigNumber.from('20000000'), // 20 USDT
	},
	aurora: {
		sym: 'aurora',
		address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
		initialFunding: ethers.BigNumber.from('2000000000000000000'), // 2 Aurora
		
	},
	atust: {
		sym: 'atust',
		address: '0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC',
		initialFunding: ethers.BigNumber.from('20000000000000000000'), // 20 atUST
	},
	usdc: {
		sym: 'usdc',
		address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
		initialFunding: ethers.BigNumber.from('20000000'), // 20 USDC
	},
};

let arb,owner;

const main = async () => {
	[owner] = await ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  const IArb = await ethers.getContractFactory('Arb');
  arb = await IArb.attach(arbContract);
	const interface = await ethers.getContractFactory('WETH9');
		
  for (let i = 0; i < Object.keys(baseAssets).length; i++) {
    const sym = Object.keys(baseAssets)[i];
		baseAssets[sym].token = await interface.attach(baseAssets[sym].address);
		const ownerBalance = await baseAssets[sym].token.balanceOf(owner.address);
    console.log(`${sym} Owner Balance: `,ownerBalance.toString());
		const arbBalance = await arb.getBalance(baseAssets[sym].address);
		console.log(`${sym} Original Arb Balance: `,arbBalance.toString());
		const tx = await baseAssets[sym].token.transfer(arbContract,baseAssets[sym].initialFunding);
		await tx.wait();
		await new Promise(r => setTimeout(r, 10000));
    const postFundBalance = await arb.getBalance(baseAssets[sym].address);
    console.log(`${sym} New Arb Balance: `,postFundBalance.toString());
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
