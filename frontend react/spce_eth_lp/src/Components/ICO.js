import React, { useState } from "react";
import { parseEther } from "ethers/lib/utils";
export default function ICO({ ICOPhase, ICOCoinsRemaining }) {
  const [buySPCEInput, setBuySPCEInput] = useState(0);
  const buyICOSpce = async (e) => {
    e.preventDefault();
    await window.spaceCoinICOContract.contribute({
      value: parseEther(buySPCEInput),
    });
  };
  return (
    <section>
      <h2>ICO</h2>
      <p>ICO Phase: {ICOPhase}</p>
      <p>SPC left to buy: {ICOCoinsRemaining}</p>
      <form id='ico_spc_buy'>
        Buy SPCE
        <input
          name='spce'
          value={buySPCEInput}
          onChange={(e) => setBuySPCEInput(e.target.value)}
        />
        <button onClick={(e) => buyICOSpce(e)}>Buy</button>
      </form>
    </section>
  );
}
