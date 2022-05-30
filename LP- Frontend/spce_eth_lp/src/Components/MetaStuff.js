export default function MetaStuff({
  signerETHBalance,
  signerAddress,
  signerSPCEBalance,
  block,
}) {
  return (
    <section>
      <h2>Meta Stuff</h2>
      <p>signer address: {signerAddress}</p>
      <p>signer ETH balance: {signerETHBalance}</p>
      <p>signer SPCE balance: {signerSPCEBalance}</p>
      <p>block: {block}</p>
    </section>
  );
}
