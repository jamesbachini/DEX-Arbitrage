const list = {
  routers: [
    {
      dex: "uniswapv3swap",
      address: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
    },
    {
      dex: "uniswapv3swap2",
      address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    },
    {
      dex: "uniswapv3universal",
      address: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    },
    {
      dex: "quickswap",
      address: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    },
    {
      dex: "kyberaggregation",
      address: "0x6131b5fae19ea4f9d964eac0408e4408b66337b5",
    },
    {
      dex: "paraswapaugustus",
      address: "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
    },
    {
      dex: "sushiswap",
      address: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    },
    {
      dex: "curve",
      address: "0xF0d4c12A5768D806021F80a262B4d39d26C58b8D",
    },
    {
      dex: "dyfn",
      address: "0xa102072a4c07f06ec3b4900fdc4c7b80b6c57429",
    },
    {
      dex: "metmask",
      address: "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
    },
  ],
  baseAssets: [
    {
      sym: "WMATIC",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
  ],
  tokens: [
    {
      sym: "USDC",
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    },
    {
      sym: "USDT",
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    },
    {
      sym: "WETH",
      address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    },
    {
      sym: "WBTC",
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    },
  ],
};
const fs = require("fs");

const routes = []; // Your routes array here

for (let i = 0; i < list.routers.length; i++) {
  const address1 = list.routers[i].address;

  for (let j = 0; j < list.routers.length; j++) {
    const address2 = list.routers[j].address;

    if (address1 !== address2) {
      for (let k = 0; k < list.tokens.length; k++) {
        routes.push([
          address1,
          address2,
          list.baseAssets[0].address,
          list.tokens[k].address,
        ]);
      }
    }
  }
}

console.log(routes);
// Convert the routes array to a JSON string
const routesJSON = JSON.stringify(routes, null, 2);

// Specify the file path where you want to save the data
const filePath = "output.json"; // You can change the file name and path

// Write the JSON data to the file
fs.writeFile(filePath, routesJSON, "utf8", (err) => {
  if (err) {
    console.error("Error writing to the file:", err);
  } else {
    console.log("Data has been written to the file:", filePath);
  }
});
