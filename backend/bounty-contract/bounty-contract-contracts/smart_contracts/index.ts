import algosdk from "algosdk"

async function deploy() {
  console.log("Deploy function started")

  const algod = new algosdk.Algodv2(
    "",
    "https://testnet-api.algonode.cloud",
    ""
  )

  const mnemonic = (process.env.DEPLOYER_MNEMONIC || "").trim()
  console.log("Mnemonic loaded:", mnemonic)

  if (!mnemonic) {
    throw new Error("DEPLOYER_MNEMONIC not set")
  }

  const account = algosdk.mnemonicToSecretKey(mnemonic)
  console.log("Deployer address:", account.addr.toString())

  const approvalProgram = `#pragma version 6
int 1`

  const clearProgram = `#pragma version 6
int 1`

  const approvalCompiled = await algod.compile(approvalProgram).do()
  const clearCompiled = await algod.compile(clearProgram).do()

  const params = await algod.getTransactionParams().do()
  params.fee = 1000
  params.flatFee = true

  const txn = algosdk.makeApplicationCreateTxnFromObject({
    sender: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approvalCompiled.result, "base64")),
    clearProgram: new Uint8Array(Buffer.from(clearCompiled.result, "base64")),
    numLocalInts: 0,
    numLocalByteSlices: 0,
    numGlobalInts: 0,
    numGlobalByteSlices: 0,
    suggestedParams: params,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  })

  const signed = txn.signTxn(account.sk)

  const txId = txn.txID().toString()
  console.log("Prepared TX ID:", txId)

  await algod.sendRawTransaction(signed).do()
  console.log("Transaction submitted")

  const result = await algosdk.waitForConfirmation(algod, txId, 30)

const appId = result["applicationIndex"] || result["application-index"]

console.log("Application deployed with app id:", appId)
}

deploy().catch(console.error)
