/* eslint-disable */
// @ts-nocheck
import * as React from 'react'
import { ethers } from 'ethers'

import BoredHonc from '../artifacts/contracts/BoredHonc.sol/BoredHonc.json'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const pinataCid = 'QmevHMEX3XQCvqFxaHcBZB4Pcon47ocNndgzLySpRsSuL6'

let provider, signer, contract

if (typeof window !== 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum)
  signer = provider.getSigner()
  contract = new ethers.Contract(contractAddress, BoredHonc.abi, signer)
}

const Mint = () => {
  const providerRef = React.useRef()
  const [balance, setBalance] = React.useState(null)
  const [totalMinted, setTotalMinted] = React.useState(null)

  const getCount = async () => {
    const count = await contract.count()

    setTotalMinted(parseInt(count))
  }

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const providerBalance = await providerRef.current.getBalance(account)
    setBalance(ethers.utils.formatEther(providerBalance))
  }

  React.useEffect(() => {
    providerRef.current = new ethers.providers.Web3Provider(window.ethereum)

    getBalance()
    getCount()
  }, [])

  return (
    <div>
      <h1>Welcome mintter </h1>
      <dl>
        <dt>Balance:</dt>
        <dd>{balance}</dd>
        <dt>Total minted:</dt>
        <dd>{totalMinted}</dd>
      </dl>

      <NFTImage tokenId={1} getCount={getCount} />
    </div>
  )
}

function NFTImage({ tokenId, getCount }) {
  const metadataURI = `${pinataCid}/metadata/${tokenId}.json`
  const imageURI = `https://gateway.pinata.cloud/ipfs/${pinataCid}/assets/${tokenId}.gif`

  const [isMinted, setIsMinted] = React.useState(false)

  React.useEffect(() => {
    if (contract) {
      getMintedStatus()
    }
  }, [isMinted, contract, signer])

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI)
    console.log({ result })
    setIsMinted(result)
  }

  const mintToken = async () => {
    const connection = contract.connect(signer)
    const addr = connection.address
    try {
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      })
      console.log({ result })

      await result.wait()

      getMintedStatus()
      getCount()
    } catch (e) {
      console.log({ e })
    }
  }

  async function getURI() {
    const uri = await contract.tokenURI(tokenId)
    alert(uri)
  }

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img
        className="card-img-top"
        src={isMinted ? imageURI : 'img/placeholder.png'}
       />
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  )
}

export { Mint }
