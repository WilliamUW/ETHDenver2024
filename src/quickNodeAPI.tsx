import { Core } from '@quicknode/sdk';

const core = new Core({
  endpointUrl: "https://docs-demo.quiknode.pro/",
  config: {
    addOns: {
      nftTokenV2: true,
    },  
  },
});

// Fetch NFT Collection Details
core.client.qn_fetchNFTCollectionDetails({
  contracts: ["0xBa38473b072f407498C5D36296A3dEbBC8A49084"],
}).then(res => {
  console.log(res);

  // Fetch NFTs By Collection
  // This call is nested within the .then() of the previous call to ensure it executes after the previous call completes.
  core.client.qn_fetchNFTsByCollection({
    collection: "0xba38473b072f407498c5d36296a3debbc8a49084",
  }).then(res => console.log(res)).catch(err => console.error("Error fetching NFTs by collection:", err));
}).catch(err => console.error("Error fetching NFT collection details:", err));
