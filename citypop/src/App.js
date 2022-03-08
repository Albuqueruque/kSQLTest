import React, { useState, useEffect } from "react";
import "./App.css";
const BaseURL = "http://localhost:8080";

function App() {
  const [status, setStatus] = useState("idle");
  const [stockPrices, setStockPrices] = useState([]);

  // //Formata o numero para dolar 
  // const formatPrice = (price) => {
  //   return new Intl.NumberFormat("us-EN", {
  //     style: "currency",
  //     currency: "USD",
  //     currencyDisplay: "narrowSymbol",
  //   }).format(price);
  // };

  const fetchStockPrice = () => {
    setStatus("idle");
    fetch(`${BaseURL}/teste`, { method: "GET" })
      .then((res) => (res.status === 200 ? res.json() : setStatus("rejected")))
      .then((result) => setStockPrices(result))
      .catch((err) => setStatus("rejected"));
    console.log("AQUI:",stockPrices);
  };

  //Atualiza as informações com a informação recebida
  const updateStockPrices = (data) => {
    const parsedData = JSON.parse(data);
    console.log("Chegou??", parsedData);
    setStockPrices((stockPrices) =>
      [...stockPrices].map((stock) => {
        if (stock.id === parsedData.id) {
          return parsedData;
        }
        return stock;
      })
    );
  };

  //Monta a tabela com as informações
  const callTable = () => {
    return (
      stockPrices.map(({ name, countryCode }, index) => (
        <tr >
          <td>{index + 1}</td>
          <td>{name}</td>
          <td>{countryCode}</td>
        </tr>
      ))
    )
  }

  //Fica verificando a url/realtime-price e chama a função fetch
  useEffect(() => {
    let isMounted = true
    const intervalId = setInterval(() => {
    fetchStockPrice();
    // const eventSource = new EventSource(`${BaseURL}/teste`);
    // eventSource.onmessage = (e) => updateStockPrices(e.data);
    // return () => {
    //   eventSource.close();
    // };
  }, 5000)
  return () => clearInterval(intervalId); //This is important
  }, []);

  //Chamar a tebela
  useEffect(() => {
    callTable()
  }, [stockPrices])

  return (
    <div className="App">
      <table>
        <caption>Informação dos paises</caption>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Nome</th>
            <th>Codigo</th>
          </tr>
        </thead>
        <tbody>
          {callTable()}
        </tbody>
      </table>
    </div>
  );
}
export default App