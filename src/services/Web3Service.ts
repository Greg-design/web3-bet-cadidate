import { MetaMaskInpageProvider } from "@metamask/providers";
import Web3 from "web3";
import ABI from "./ABI.json";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const CONTRACT_ADDRESS = "0x7123B194C4852bcb1591Fd07ECf5d7F1279bDCb8";

// conectar na carteira
export async function login() {
  if (!window.ethereum) throw new Error("MetaMask não está instalada");

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();
  if (!accounts || !accounts.length) throw new Error("MetaMask não foi autorizada!");

  localStorage.setItem("wallet", accounts[0]);
  return accounts[0];
}

// funcao de conexao com o contrato
function getContract() {
  if (!window.ethereum) throw new Error("MetaMask não está instalada");

  const from = localStorage.getItem("wallet") || undefined;
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

// funcao de pegar dados da disputa
export async function getDispute() {
  const constract = getContract();
  return constract.methods.dispute().call();
}

// operaçao de aposta
export async function placeBet(candidate: number, amountInEth: number | string) {
  const constract = getContract();
  return constract.methods.bet(candidate).send({
    value: Web3.utils.toWei(amountInEth, "ether"),
    gasPrice: "30000000015",
  });
}

// operaçao de finalizar
export async function finishDispute(winner: string | number) {
  const constract = getContract();
  return constract.methods.finish(winner).send({
    gasPrice: "30000000015",
  });
}

// operaçao de pegar premio
export async function claimPrize() {
  const constract = getContract();
  return constract.methods.claim().send({
    gasPrice: "30000000015",
  });
}
