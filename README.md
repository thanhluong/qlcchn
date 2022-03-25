# qlcchn
Quan Ly Chung Chi Hanh Nghe Bang Blockchain

1. Create the test network and a channel (from the `test-network` folder).
   ```
   ./network.sh up createChannel -c mychannel -ca
   ```
2. Deploy the smart contract implementations (from the `test-network` folder).
   ```
   # To deploy the Javascript chaincode implementation
   ./network.sh deployCC -ccn basic -ccp ../qlcchn/chaincode-javascript/ -ccl javascript
   ```

3. Run the application (from the `qlcchn` folder)

   ```
   cd webapp
   npm install
   node init.js
   node server.js
   ```