# Simple Dex Arbitrage

This code base was created as part of an intermediate solidity tutorial available here:

https://jamesbachini.com/dex-arbitrage/

Please note that Aurora on Near Protocol have now introduced gas/transaction fees. More info on their twitter account https://twitter.com/AuroraIsNear
If running it on that chain you need a little ETH to pay gas fees in the owner address wallet that is firing off transactions.

## Disclaimer
Note the code is provided for educational purposes, is unaudited and not fit for financial transactions. Use it to experiment with and build your own strategies. A technical support call center is not available if you get funds stuck so make sure to test the recover.js script before doing anything else. Use on a testnet with play money or with funds you are willing to lose.

## Setup Instructions
Edit the .env-example.txt file and add a private key, create one using this script if necessary:-
https://github.com/jamesbachini/Ethers-Vanity-Address

Build using the following commands:

```shell
git clone https://github.com/jamesbachini/DEX-Arbitrage.git
cd DEX-Arbitrage
mv .env-example.txt .env
npm install
npx hardhat run --network aurora .\scripts\deploy.js
```

Then add the arbContract deployment address to config/aurora.json edit the base assets and move the funds across to the the arbContract address.

Then to execute run:-

```shell
npx hardhat run --network aurora .\scripts\deploy.js
```

Finally to recover any funds use the script.

```shell
npx hardhat run --network aurora .\scripts\recover.js
```

More info and solidity tutorials on my blog at https://jamesbachini.com
