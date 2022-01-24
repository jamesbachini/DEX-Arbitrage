const hre = require("hardhat");
const fs = require("fs");
const tokenList = require("./../data/tokenList.json");
const routes = require("./../data/uniqueRoutes.json");
require("dotenv").config();

const arbContract = process.env.arbContract;
// Aurora Mainnet
const trisolarisRouter = "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B";
const wannaswapRouter = "0xa3a1ef5ae6561572023363862e238afa84c72ef5";
const auroraswapRouter = "0xA1B1742e9c32C7cAa9726d8204bD5715e3419861";
const roseRouter = "0xc90dB0d8713414d78523436dC347419164544A3f";

console.log(`Loaded ${routes.length} routes`);

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

let arb,tokenAddresses,owner,inTrade;

const main = async () => {
	await setup();
	tokenAddresses = [];
	tokenList.tokens.forEach((token) => {
		tokenAddresses.push(token.address);
	});

	[0,0,0,0,0,0,0,0,0].forEach(async (v,i) => {
		await new Promise(r => setTimeout(r, i*1000));
		await lookForDualTrade();
	});
	await lookForDualTrade();
}

const searchForRoutes = () => {
	const targetRoute = {};
	const routers = [trisolarisRouter,wannaswapRouter,auroraswapRouter,roseRouter];
	targetRoute.router1 = routers.sort(function() { return 0.5 - Math.random();}).pop();
	targetRoute.router2 = routers.sort(function() { return 0.5 - Math.random();}).pop();
	targetRoute.baseSym = Object.keys(baseAssets).sort(function() { return 0.5 - Math.random();})[0];
	targetRoute.baseToken = baseAssets[targetRoute.baseSym];
	targetRoute.token1 = baseAssets[targetRoute.baseSym].address;
	targetRoute.token2 = tokenAddresses[Math.floor(Math.random()*tokenAddresses.length)];
	return targetRoute;
}

let goodCount = 0;
const useGoodRoutes = () => {
	const targetRoute = {};
	const route = routes[goodCount];
	goodCount += 1;
	if (goodCount >= routes.length) goodCount = 0;
	targetRoute.router1 = route[0];
	targetRoute.router2 = route[1];
	targetRoute.baseSym = route[2];
	targetRoute.token1 = route[3];
	targetRoute.token2 = route[4];
	targetRoute.baseToken = baseAssets[targetRoute.baseSym];
	return targetRoute;
}

const lookForDualTrade = async () => {
	const targetRoute = useGoodRoutes();
	try {
		let tradeSize = targetRoute.baseToken.size;
		const goodTrade = await arb.checkDualDexTrade(targetRoute.router1, targetRoute.router2, targetRoute.token1, targetRoute.token2, tradeSize);
		if (goodTrade) {
			//fs.appendFile('./data/multiTrades.txt', `${targetRoute.router1},${targetRoute.router2},${targetRoute.baseToken.sym},${targetRoute.token1},${targetRoute.token2}`+"\n", function (err) {});
			await dualTrade(targetRoute.router1,targetRoute.router2,targetRoute.token1,targetRoute.token2,tradeSize);
		} else {
			await lookForDualTrade();
		}
	} catch (e) {
		console.log(e);
		await lookForDualTrade();	
	}
}

const dualTrade = async (router1,router2,baseToken,token2,amount) => {
	if (inTrade === true) return false;
	try {
		inTrade = true;
		console.log('> Making dualTrade...');
		const tx = await arb.connect(owner).dualDexTrade(router1, router2, baseToken, token2, amount);
		await tx.wait();
    inTrade = false;
		// try again?
		const goodTrade = await arb.checkDualDexTrade(router1, router2, baseToken, token2, amount);
		if (goodTrade) {
			await dualTrade(router1,router2,baseToken,token2,amount);
		} else {
			await lookForDualTrade();
		}
	} catch (e) {
		console.log(e);
		inTrade = false;
		await lookForDualTrade();
	}
}

const setup = async () => {
	[owner] = await ethers.getSigners();
	console.log(`Owner: ${owner.address}`);
	const IArb = await ethers.getContractFactory('Arb');
	arb = await IArb.attach(arbContract);
  for (let i = 0; i < Object.keys(baseAssets).length; i++) {
    const sym = Object.keys(baseAssets)[i];
		const interface = await ethers.getContractFactory('WETH9');
		baseAssets[sym].token = await interface.attach(baseAssets[sym].address);
		const bal = await baseAssets[sym].token.balanceOf(arbContract);
		console.log(sym, bal.toString());
		baseAssets[sym].size = bal;
		baseAssets[sym].startSize = bal;
		baseAssets[sym].sizeArray = [bal];
	}
	setTimeout(() => {
		setInterval(() => {
			logResults();
		}, 60000);
	}, 120000);
}

const logResults = () => {
	if (new Date().getMinutes() == 0 || new Date().getMinutes() == 15 || new Date().getMinutes() == 30 || new Date().getMinutes() == 45) {
		console.log(`############# LOGS #############`);
		console.log(`#  ${new Date().toUTCString()}`);
		Object.keys(baseAssets).forEach(async (sym,i) => {
			const bal = await baseAssets[sym].token.balanceOf(owner.address);
			baseAssets[sym].size = bal;
			const diff = baseAssets[sym].size.sub(baseAssets[sym].startSize);
			const percentage = diff.mul(10000).div(baseAssets[sym].startSize);
			baseAssets[sym].sizeArray.push(baseAssets[sym].size);
			if (baseAssets[sym].sizeArray.length > 4) baseAssets[sym].sizeArray.shift();
			const hourDiff = baseAssets[sym].size.sub(baseAssets[sym].sizeArray[0]);
			const hourPercentage = hourDiff.mul(10000).div(baseAssets[sym].sizeArray[0]);
			console.log(`#  ${sym}: ${percentage.toString()}bps  (${hourPercentage.toString()}bps/hr)`);
			fs.appendFile('./data/balances.txt', `${sym},${baseAssets[sym].startSize},${baseAssets[sym].size}, ${percentage.toString()}bps,${hourPercentage.toString()}bps`+"\n", function (err) {});
		});
	}
}
const checkBalance = async (sym) => {
	const balance = await arb.getBalance(baseAssets[sym].address);
	console.log('Balance',balance.toString());
}

const recover = async (sym) => {
	let balance = await arb.getBalance(baseAssets[sym].address);
	console.log('Balance',balance.toString());
	await arb.connect(owner).recoverTokens(baseAssets[sym].address);
	balance = await arb.getBalance(baseAssets[sym].address);
	console.log('Balance',balance.toString());
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
