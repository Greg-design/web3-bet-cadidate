"use client";

import { claimPrize, getDispute, placeBet } from "@/services/Web3Service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Web3 from "web3";

export default function Bet() {
  const [message, setMessage] = useState("");
  const [dispute, setDispute] = useState({
    candidate1: "Loading...",
    candidate2: "Loading...",
    image1:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FAnonymous&psig=AOvVaw1G8ZcXJhbsyAMkhqvQGnb_&ust=1728139220147000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPitvtf69IgDFQAAAAAdAAAAABAS",
    image2:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FAnonymous&psig=AOvVaw1G8ZcXJhbsyAMkhqvQGnb_&ust=1728139220147000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPitvtf69IgDFQAAAAAdAAAAABAS",
    total1: 0,
    total2: 0,
    winner: 0,
  });

  const { push } = useRouter();

  // verifica se o usuario esta ou nao autenticado, se estiver carrega a pagina com os dados
  useEffect(() => {
    if (!localStorage.getItem("wallet")) return push("/");
    setMessage("Obtendo dados da disputa...aguarde..");
    getDispute()
      .then((dispute) => {
        if (dispute && typeof dispute === "object" && !Array.isArray(dispute)) {
          setDispute(dispute);
        } else {
          setDispute({
            candidate1: "Candidato 1",
            candidate2: "Candidato 2",
            image1:
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FAnonymous&psig=AOvVaw1G8ZcXJhbsyAMkhqvQGnb_&ust=1728139220147000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPitvtf69IgDFQAAAAAdAAAAABAS",
            image2:
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.wikipedia.org%2Fwiki%2FAnonymous&psig=AOvVaw1G8ZcXJhbsyAMkhqvQGnb_&ust=1728139220147000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPitvtf69IgDFQAAAAAdAAAAABAS",
            total1: 0,
            total2: 0,
            winner: 0,
          });
        }
        setMessage("");
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  }, []);

  function processBet(candidate: number) {
    setMessage("Conectando na carteira...aguarde...");
    const amount = prompt("Quantidade em POL para apostar:", "1");
    if (amount !== null) {
      placeBet(candidate, amount)
        .then(() => {
          alert("Aposta recebida com sucesso. Pode demorar 1 minuto para que apareça no sistema.");
          setMessage("");
        })
        .catch((err) => {
          console.error("Erro ao realizar a aposta:", err);
          setMessage(err.message);
        });
    } else {
      alert("Aposta cancelada.");
    }
  }

  function btnClaimClick() {
    setMessage("Conectando na carteira...aguarde...");
    claimPrize()
      .then(() => {
        alert("Premio coletado com sucesso. Pode demorar 1 minuto para que apareça na sua carteira.");
        setMessage("");
      })
      .catch((err) => {
        console.error("Erro ao realizar a aposta:", err);
        setMessage(err.message);
      });
  }

  return (
    <>
      <div className="container px-4 py-5">
        <div className="row align-items-center">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">BetCandidate</h1>
          <p className="lead">Apostas on-chain nas eleições americanas.</p>

          {dispute.winner === 0 ? (
            <p className="lead">Você tem até o dia da eleição para deixar sua aposta em um dos candidatos abaixo.</p>
          ) : (
            <p className="lead">Disputa encerrada. Veja o vencedor abaixo e solicite seu premio.</p>
          )}
        </div>
        <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
          <div className="col"></div>

          {dispute.winner === 0 ? (
            <div>
              {/* Caso ainda não haja vencedor, exibir os botões de aposta */}
              <div className="col">
                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                  {dispute.candidate1}
                </h3>
                <img src={dispute.image1} className="d-block mx-auto img-fluid rounded" width={250} />
                <button
                  className="btn btn-primary p-3 my-2 d-block mx-auto"
                  style={{ width: 250 }}
                  onClick={() => processBet(1)}
                >
                  Aposto nesse candidato
                </button>
                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>
                  {Web3.utils.fromWei(dispute.total1, "ether")} POL Apostados
                </span>
              </div>

              <div className="col">
                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                  {dispute.candidate2}
                </h3>
                <img src={dispute.image2} className="d-block mx-auto img-fluid rounded" width={250} />
                <button
                  className="btn btn-primary p-3 my-2 d-block mx-auto"
                  style={{ width: 250 }}
                  onClick={() => processBet(2)}
                >
                  Aposto nesse candidato
                </button>
                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>
                  {Web3.utils.fromWei(dispute.total2, "ether")} POL Apostados
                </span>
              </div>
            </div>
          ) : (
            <div>
              {/* Caso já haja um vencedor, exibir o botão de pegar o prêmio */}
              {dispute.winner === 1 ? (
                <div className="col">
                  <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                    {dispute.candidate1} - Vencedor!
                  </h3>
                  <img src={dispute.image1} className="d-block mx-auto img-fluid rounded" width={250} />
                  <button
                    className="btn btn-primary p-3 my-2 d-block mx-auto"
                    style={{ width: 250 }}
                    onClick={btnClaimClick}
                  >
                    Pegar meu prêmio
                  </button>
                  <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>
                    {Web3.utils.fromWei(dispute.total1, "ether")} POL Apostados
                  </span>
                </div>
              ) : (
                <div className="col">
                  <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                    {dispute.candidate2} - Vencedor!
                  </h3>
                  <img src={dispute.image2} className="d-block mx-auto img-fluid rounded" width={250} />
                  <button
                    className="btn btn-primary p-3 my-2 d-block mx-auto"
                    style={{ width: 250 }}
                    onClick={btnClaimClick}
                  >
                    Pegar meu prêmio
                  </button>
                  <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>
                    {Web3.utils.fromWei(dispute.total2, "ether")} POL Apostados
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="row align-items-center">
          <p className="message">{message}</p>
        </div>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-4 mb-0 text-body-secondary">&copy; 2024 BetCandidate, Inc</p>
          <ul className="nav col-4 justify-content-end">
            <li className="nav-item">
              <a href="/" className="nav-link px-2 text-body-secondary">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link px-2 text-body-secondary">
                About
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
