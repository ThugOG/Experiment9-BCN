import { ContractAddress, IssuerABI, abi } from "./constants.js";
import { BigNumber, ethers } from "./ethers-5.6.esm.min.js";
let hash;
const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;
const submitIt = document.getElementById("submit");
submitIt.onclick = submit;
const uploadButton = document.getElementById("upload")
uploadButton.onclick = uploadToIpfs

// const getData = document.getElementById('getUsers')
// getData.onclick = displayAllAvailableAndWhitelisted
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
  }
}

async function submit() {
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const age = document.getElementById("age");
  const cert_ty = document.getElementById("cert_ty");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    try {
      const transactionResponse = await contract.getDetailsAndStore(
        fname.value,
        lname.value,
        age.value,
        // hash,
        cert_ty.value
      );
      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  }
}

//getUserDetails

// async function displayAllAvailableAndWhitelisted(){
//   if(typeof window.ethereum !== "undefined"){

//     const provider = new ethers.providers.Web3Provider(window.ethereum)
//     const signer = provider.getSigner()
//     const contract = new ethers.Contract("0xa9Ca72893f397CAe3999cAE8e053E3846A03b63e", IssuerABI, signer)

//     try{
//       const transactionResponse = await contract.getAllUsers();
//       console.log(transactionResponse)
      
//     }
//     catch(error){
//       console.log(error);
//     }
//   }
// }


async function uploadToIpfs() {
  const fileUpload = document.getElementById('fileUpload');
  if (!fileUpload.files.length) {
      return alert('Please select a file to upload');
  }

  const file = fileUpload.files[0];
  const reader = new FileReader();
  reader.onloadend = async function() {
      const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      let data = new FormData();
      data.append('file', new Blob([reader.result], {type: file.type}), file.name);

      const metadata = JSON.stringify({
          name: file.name,
      });
      data.append('pinataMetadata', metadata);

      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'pinata_api_key': '529caa00b6bd5c0193d2',
              'pinata_secret_api_key': '576751a070a7ffc293f9d7f1ecd232c02ef396ab624b48f5f5ead049fc77c242',
          },
          body: data
      });

      if (response.ok) {
          const result = await response.json();
          document.getElementById('output').innerText = `Uploaded to IPFS with CID: ${result.IpfsHash}`;
          hash = result.IpfsHash;
      } else {
          console.error('Upload failed:', response);
      }
  }
  reader.readAsArrayBuffer(file);
}