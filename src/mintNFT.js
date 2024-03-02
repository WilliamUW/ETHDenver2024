export default function mintNFT() {
    console.log("Minting NFT");
    const form = new FormData();
    form.append('chain', 'sepolia');
    form.append('recipientAddress', '0x0E5d299236647563649526cfa25c39d6848101f5');
    form.append('name', 'BeFit for March 2nd');
    form.append('description', 'BeFit ');
    form.append('data', 'https://images-ext-1.discordapp.net/external/vCzV1HktGL3LbnfrewWMUPh_NC5usJKfSFqS_rHcXA4/https/assets.devfolio.co/hackathons/f3d1fd4a9c8742e39d40c74dff7783b2/projects/4f6bac589ce04f0aaae931876580477e/bf6b8ca6-e59c-4412-b8ea-d6886bc39a56.jpeg?format=webp&width=516&height=270');
    form.append('imageUrl', 'https://images-ext-1.discordapp.net/external/vCzV1HktGL3LbnfrewWMUPh_NC5usJKfSFqS_rHcXA4/https/assets.devfolio.co/hackathons/f3d1fd4a9c8742e39d40c74dff7783b2/projects/4f6bac589ce04f0aaae931876580477e/bf6b8ca6-e59c-4412-b8ea-d6886bc39a56.jpeg?format=webp&width=516&height=270');
    
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-Key': 'sk_live_5b963604-629c-4156-ac69-433d1db6f108'
      }
    };
    
    options.body = form;
    
    fetch('https://api.verbwire.com/v1/nft/mint/quickMintFromMetadata', options)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        const transactionID = response.transaction_details.transactionID;
        console.log(transactionID);
        return transactionID;
      })
      .catch(err => console.error(err));
  }

