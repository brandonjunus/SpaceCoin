/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SpaceCoinICO,
  SpaceCoinICOInterface,
} from "../../contracts/SpaceCoinICO";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum SpaceCoinICO.ICO_PHASE",
        name: "ICOPhase",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalContributed",
        type: "uint256",
      },
    ],
    name: "Contribution",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SpaceCoinICO.ICO_PHASE",
        name: "ICOPhase",
        type: "uint8",
      },
    ],
    name: "PhaseAdvance",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "ReedemTokens",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "WhitelistedAddress",
    type: "event",
  },
  {
    inputs: [],
    name: "ICOPhase",
    outputs: [
      {
        internalType: "enum SpaceCoinICO.ICO_PHASE",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_whitelistedAddress",
        type: "address[]",
      },
    ],
    name: "addToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum SpaceCoinICO.ICO_PHASE",
        name: "phase",
        type: "uint8",
      },
    ],
    name: "advanceICOPhase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "redeemTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "reedeemableContributions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "seedWhitelist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spaceCoinAddress",
        type: "address",
      },
    ],
    name: "setSpaceCoinAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleAllowContributions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalContributed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405260008060006101000a81548160ff0219169083600281111562000050577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055506001600060016101000a81548160ff0219169083151502179055503480156200007d57600080fd5b5060405162004003380380620040038339818101604052810190620000a3919062000197565b620000d77f26bb5332cbfb7e8f6805d8fe0bc8fa38e2795c88e9596d7e83aa27e0c68ae36660001b6200017d60201b60201c565b6200010b7f468644c399a5e62fcb01293e41e1ea7c7f463b966055a81b104b2e0dcc3498f260001b6200017d60201b60201c565b6200013f7f94d19c45c02525c1610a886a1c702a685aaf98b3f216f39fa34918babcc037f760001b6200017d60201b60201c565b8073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b815250505062000211565b50565b6000815190506200019181620001f7565b92915050565b600060208284031215620001aa57600080fd5b6000620001ba8482850162000180565b91505092915050565b6000620001d082620001d7565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6200020281620001c3565b81146200020e57600080fd5b50565b60805160601c613db06200025360003960008181610309015281816104760152818161070101528181610ab101528181610ed601526111340152613db06000f3fe60806040526004361061009c5760003560e01c806395b41bec1161006457806395b41bec14610174578063ae0120b41461018b578063c2b6400c146101c8578063d7bb99ba146101f1578063e1f42133146101fb578063e9a9c50c146102385761009c565b8063023f4147146100a15780633ccfd60b146100cc5780635325d806146100f75780636fdd78c3146101205780637f6497831461014b575b600080fd5b3480156100ad57600080fd5b506100b661024f565b6040516100c3919061381d565b60405180910390f35b3480156100d857600080fd5b506100e1610255565b6040516100ee9190613627565b60405180910390f35b34801561010357600080fd5b5061011e600480360381019061011991906132e0565b61064f565b005b34801561012c57600080fd5b506101356109ee565b6040516101429190613642565b60405180910390f35b34801561015757600080fd5b50610172600480360381019061016d9190613309565b6109ff565b005b34801561018057600080fd5b50610189610e24565b005b34801561019757600080fd5b506101b260048036038101906101ad91906132e0565b61106a565b6040516101bf919061381d565b60405180910390f35b3480156101d457600080fd5b506101ef60048036038101906101ea9190613377565b611082565b005b6101f9611ab4565b005b34801561020757600080fd5b50610222600480360381019061021d91906132e0565b612186565b60405161022f9190613627565b60405180910390f35b34801561024457600080fd5b5061024d6121a6565b005b60015481565b60006102837f65ef5920985fdd23d20d3ae0f8583cc0d9f1abc4aca6b5b25dc8b272037487c860001b612769565b6102af7f35d8598f203ddba4433778c75cbac13a729acad560146c76f5b5b2beabd8664660001b612769565b6102db7f5996bfd7d160b2fc0b8455d79d031b50eb5bcbadf14d56d7bcde2b3c56102cc360001b612769565b6103077f24970e8d638d7c6e441eb347746e698effde7efd3fc93537ef5d6962f2be2f9560001b612769565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610395576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038c906137dd565b60405180910390fd5b6103c17f5e6e4229659a8d0ea56d42fd6a2dbd5c8cfdc116607daa6cad2de6d6bcf0a87160001b612769565b6103ed7f069aa5bf5bdd5c3efc6958fc928dd864df5a338417f8b5b632efb84589e1823f60001b612769565b6104197f1b18347ad37fb138c9796b040a698825be6d7180e1079a56f98d7e6843d2a27160001b612769565b6104457f1a727104d60a37056188132fdcefac101716ae6785bb2604d07aeed1d46774ae60001b612769565b6104717f06c6d4eac13051c58805d5a3782b0655d4d2f873638959ba582422e09004623760001b612769565b6000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16476040516104b8906135e9565b60006040518083038185875af1925050503d80600081146104f5576040519150601f19603f3d011682016040523d82523d6000602084013e6104fa565b606091505b509150915061052b7f18c993b5ab1be8a2a4bd73d108d9c9e664ccfd74119b889398664afc3dbf33f460001b612769565b6105577feb146d4185d5949d86189fb801c0efcb88da600c5f83b94567142476f35fe07160001b612769565b6105837fc6fec2b273f902d10deb5ab808f7bdf685972c801e7d8b26bb7a2b1698c9a4d360001b612769565b816105c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105ba9061369d565b60405180910390fd5b6105ef7f756d39a5a1be650e0d335cc4b1cfeef329c0c367353fdd714315a54a716f1cab60001b612769565b61061b7f3c07430574fe2af821f2767effc2d97c3055bdd94a2f3fc8f99105f5f3d6939260001b612769565b6106477f64ee760cc201b5d84c8bf428e54208702b0d6254ade570e6b18ed48c6892f5a260001b612769565b819250505090565b61067b7f65ef5920985fdd23d20d3ae0f8583cc0d9f1abc4aca6b5b25dc8b272037487c860001b612769565b6106a77f35d8598f203ddba4433778c75cbac13a729acad560146c76f5b5b2beabd8664660001b612769565b6106d37f5996bfd7d160b2fc0b8455d79d031b50eb5bcbadf14d56d7bcde2b3c56102cc360001b612769565b6106ff7f24970e8d638d7c6e441eb347746e698effde7efd3fc93537ef5d6962f2be2f9560001b612769565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461078d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610784906137dd565b60405180910390fd5b6107b97f5e6e4229659a8d0ea56d42fd6a2dbd5c8cfdc116607daa6cad2de6d6bcf0a87160001b612769565b6107e57f069aa5bf5bdd5c3efc6958fc928dd864df5a338417f8b5b632efb84589e1823f60001b612769565b6108117f0c2738095c7a026c0b562ce744789373553ca5b2e51ea421237eba5637fba8fc60001b612769565b61083d7f741ad528cbef5d726ddb9019c416cc8c2f095904f07a3f06e36bdb650456eb4b60001b612769565b6108697f640e4f5ea1b20af67dbc996cfb4094dc300e6144aa5005a68679486deab50b9f60001b612769565b6108957fe421dbf808f237de0a5ae58023d8702d1da2197d552e520df39e6d80874b401960001b612769565b600073ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610926576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091d906136fd565b60405180910390fd5b6109527f7a14f9b091e7ca6ac35192ba3601298a010d9751a6317d86045cf737ed9ca6c360001b612769565b61097e7fde3e89a545822691b52550a3579db930683d99ab85d6fdb8544239485166610760001b612769565b6109aa7ffe76d594cdc300f7c8794a1340e305f694b9c7bd0bd657e41497b16298c3f49c60001b612769565b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008054906101000a900460ff1681565b610a2b7f65ef5920985fdd23d20d3ae0f8583cc0d9f1abc4aca6b5b25dc8b272037487c860001b612769565b610a577f35d8598f203ddba4433778c75cbac13a729acad560146c76f5b5b2beabd8664660001b612769565b610a837f5996bfd7d160b2fc0b8455d79d031b50eb5bcbadf14d56d7bcde2b3c56102cc360001b612769565b610aaf7f24970e8d638d7c6e441eb347746e698effde7efd3fc93537ef5d6962f2be2f9560001b612769565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b3d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b34906137dd565b60405180910390fd5b610b697f5e6e4229659a8d0ea56d42fd6a2dbd5c8cfdc116607daa6cad2de6d6bcf0a87160001b612769565b610b957f069aa5bf5bdd5c3efc6958fc928dd864df5a338417f8b5b632efb84589e1823f60001b612769565b610bc17f0c9f32a7f770a0ab2e1b4b42b7a751143af088e865e994d64f0700c19b6bf3a260001b612769565b610bed7fb98a25df91df49214861957f00e35ac7945be4cdc9b445fa3b5d71dc6d96667360001b612769565b610c197f888f8945cfb518643260f4db77924452376dfc4fe7968f678529b940118bd0b360001b612769565b60005b82829050811015610e1f57610c537f03cd6bbf142b1ef3518a42e66d9ffe7939812a27537b603b580eb96109c72ca960001b612769565b610c7f7f116b4899a54f1074d0cb7da8eaee389fa627644da5884ec4c2724dab029fe92160001b612769565b600160036000858585818110610cbe577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9050602002016020810190610cd391906132e0565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610d507f61cd9af89c447621d52e6be383aac9256289483f9a572b7081bdcf1b850c055060001b612769565b610d7c7fb68796437450b0f6334eb8ae46751d251523b3351d6f3f60751acb550f90648060001b612769565b828282818110610db5577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9050602002016020810190610dca91906132e0565b73ffffffffffffffffffffffffffffffffffffffff167f9659de77bedae44137acf94b0b2a83c1a7e51fec986c5d6098bbde7e4f0d02e860405160405180910390a28080610e17906139a8565b915050610c1c565b505050565b610e507f65ef5920985fdd23d20d3ae0f8583cc0d9f1abc4aca6b5b25dc8b272037487c860001b612769565b610e7c7f35d8598f203ddba4433778c75cbac13a729acad560146c76f5b5b2beabd8664660001b612769565b610ea87f5996bfd7d160b2fc0b8455d79d031b50eb5bcbadf14d56d7bcde2b3c56102cc360001b612769565b610ed47f24970e8d638d7c6e441eb347746e698effde7efd3fc93537ef5d6962f2be2f9560001b612769565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610f62576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f59906137dd565b60405180910390fd5b610f8e7f5e6e4229659a8d0ea56d42fd6a2dbd5c8cfdc116607daa6cad2de6d6bcf0a87160001b612769565b610fba7f069aa5bf5bdd5c3efc6958fc928dd864df5a338417f8b5b632efb84589e1823f60001b612769565b610fe67fc99c14ba97be081d554efc3f674d9e8a0de7047511e6bd127bc50aad9a98931a60001b612769565b6110127f6d9f8e04ef4604d73974b395ee0ff2d70609d13029252da0727720b3922da0aa60001b612769565b61103e7fd39a929d0e936bb0841c92edb6aaf26c9c9b8c3937814af10355d5f153e9e29060001b612769565b600060019054906101000a900460ff1615600060016101000a81548160ff021916908315150217905550565b60026020528060005260406000206000915090505481565b6110ae7f65ef5920985fdd23d20d3ae0f8583cc0d9f1abc4aca6b5b25dc8b272037487c860001b612769565b6110da7f35d8598f203ddba4433778c75cbac13a729acad560146c76f5b5b2beabd8664660001b612769565b6111067f5996bfd7d160b2fc0b8455d79d031b50eb5bcbadf14d56d7bcde2b3c56102cc360001b612769565b6111327f24970e8d638d7c6e441eb347746e698effde7efd3fc93537ef5d6962f2be2f9560001b612769565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146111c0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111b7906137dd565b60405180910390fd5b6111ec7f5e6e4229659a8d0ea56d42fd6a2dbd5c8cfdc116607daa6cad2de6d6bcf0a87160001b612769565b6112187f069aa5bf5bdd5c3efc6958fc928dd864df5a338417f8b5b632efb84589e1823f60001b612769565b6112447ff129fd6cf44706b24ed0c485af6e9a59606da5b8e3fd5719e0413c3a76be629360001b612769565b6112707f6c86d17c3c01f532eabb62981a96b99c07f892421467d9e52d595b1349b510a960001b612769565b61129c7f882dc4e0d0717e06de08145194a9ff28a3227cc27b72a5d8b8b556ba0c8b5bec60001b612769565b6112c87ff1403e4ce417243c0617d5f673b02e1d91bd7b814efe7aec00f97e6a1151e95b60001b612769565b600280811115611301577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff166002811115611347577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415611388576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161137f906136bd565b60405180910390fd5b6113b47f7f82dd4c300ee4274abe9937b30347f52a7bad8fad5a6822e5b2e8f3268a63d160001b612769565b6113e07f0e65c7de15655b3a4506f38a62004d005da5babf52e9e2e076184931a707f8a160001b612769565b61140c7fc1e8425e83b8d1a048b4af85e98842a9b3e3382f7f44dc7074cf592924eed43560001b612769565b60006002811115611446577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff16600281111561148c577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156116ce576114be7ff02b5a3d52926a4c457b759c1789af65dd133906d47f93eefe37bb9ab90fc38460001b612769565b6114ea7f7d6ea208be2b747e46dd815e722f974748bf9fceb0b7e033dd36c7f2ce2f2ebb60001b612769565b6115167fca5450a73565f2f793f77d9669ddc44d5cc292bffbc0981196ef66ba6ee0a8b960001b612769565b6115427f0dfb7517016adba8dba1c1709ceb79d71d826e0e2951d76511cd4157ad810fb860001b612769565b6001600281111561157c577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8160028111156115b5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146115f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ec906137fd565b60405180910390fd5b6116217f9c1afc7620ede19150b22321e2b2dc0428bf03c793c281f21b89538027db249060001b612769565b61164d7f1431a22f7e70f3e98a6a490b8a4f5c0385f5cac8c255f32da44738b8d3d056bb60001b612769565b6116797f62bc576492a8cfa4ee5d23d555089e514bd87382db2878da408e0d33f42df70760001b612769565b60016000806101000a81548160ff021916908360028111156116c4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550611a15565b6116fa7ff1b49b9b3ef53a5f6d1f8ee205e9e3823adcd1e973484af1529001350c83166160001b612769565b6117267fc5dccf1f634ca3a28ce7710e90588ceaee4635b23014d4b8041257820470a3f960001b612769565b60016002811115611760577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff1660028111156117a6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156119e7576117d87f289d1e505ac12ee7c3eca01e229d19a2ae882eed0c2f8aa4cc1b397c9903509b60001b612769565b6118047f349658de3fc326c6b68a8abf9aed809c92b880962a7522b335e5fc008408fced60001b612769565b6118307f87a7cf81ec4c45bfe0c485a607ea829bdbc613d02312cf4debd9c55100e8541560001b612769565b61185c7f2c9fe9418e2155f0bec2a754d0045e2d574ef896534cc930a4c9ff01eeccf26760001b612769565b600280811115611895577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b8160028111156118ce577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1461190e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611905906137fd565b60405180910390fd5b61193a7fac39d248bded6a1720b30c9d8b93b502122eb0c9bd4f0e240f6bc5d444a40c7c60001b612769565b6119667fb561591516da6f55c4fbaf836feef14b91bc2aca579d62bfa475137199eb322b60001b612769565b6119927fb5b548438d11856181d00baa61242847b3d5c73c58292a4fa74b604fff250c3060001b612769565b60026000806101000a81548160ff021916908360028111156119dd577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b0217905550611a14565b611a137f24f91de928544debecb50d4b1ef70aee264a53053b8f769a0c17e6099339e4a960001b612769565b5b5b611a417f8d1e5f2b4de282d16ab65460f7acc92db1fc4d604c1432ba6e8643dfa0520db260001b612769565b611a6d7f06fb5c9c7487e6133f308ee4e3b95e5777a5ad442a49d0b6ad9abcbec2133e4560001b612769565b7f8ebfeb717d1d825f3a8fc9bfc3f381534bf92170a395707a9f3e08aef597842560008054906101000a900460ff16604051611aa99190613642565b60405180910390a150565b611ae07f7a20abec352e0998b7ba2d3e414f00bb59b4fa87426e2fcdff0c9ce0b2f5f86960001b612769565b611b0c7ffa0501ff08f3cd5e622faf86bb785d12d2bfcb2b42baa87a841ec772e1a6917d60001b612769565b611b387f81f1e6f395addaef43cba3a37d626d44a1f1292517c9108f1b2a99da161ab6f260001b612769565b611b647f63cf861973854a5701046027f20a5719455f4b4d53443100ecc717bbcaff54d660001b612769565b600060019054906101000a900460ff16611bb3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611baa9061367d565b60405180910390fd5b611bdf7f976777d44ccf0d44b86f372ff0e8b21a49b19bb9070f1fc3530de67b5423909360001b612769565b611c0b7f944ae7919799e5a64a964a79e05928bf6e511b431d9daee229b72c63e7b6795560001b612769565b611c377f1865e517cd52fcbf1154a2e58f67d3e49a96a1311277a155fd3b200f8c999d2d60001b612769565b60006002811115611c71577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff166002811115611cb7577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415611d4e57611ce97f2cde893b69ce2cc4814da417f2b5ef45c9f85077917138731e7882d53f0af8af60001b612769565b611d157ffafeb4e6d75ca6e6a9c28b6acda12df4e5cd775d9cb308e41a9838dc80198d6b60001b612769565b611d417f0aedcbeef97e72eb32eb7dedba776a517592e0ee4418598aaa7c27f868e1e14360001b612769565b611d4961276c565b61205a565b611d7a7f25f47186604f9588494549a1d34c8e150053bb384f6e47f54c77d5f94792386860001b612769565b611da67fd4aaeff5a0d1d82fdd506069b04f191b623f07c6232862b8393cdb0d314f5fb460001b612769565b60016002811115611de0577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff166002811115611e26577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1415611ebd57611e587f946af77b20963f378935e543e5aedead551ba639ddf4d75428fcfdf42f46f46460001b612769565b611e847f6af73886a241cd645467f96038acb43b9f4cf1bdfd142200ea4f16896fa108bc60001b612769565b611eb07ff37dac1fc2c4773d672a86f25d1f433f48f9ed8dc3c36760873b6fe6977c0eff60001b612769565b611eb8612bdb565b612059565b611ee97fd978ba31bc45359ab0ad4121aebbd757ae04b95719798a0c4ec3e9fe9cd9059e60001b612769565b611f157fc31bdf453f00e7ee6084e58340914f1e49aff8dc9b1bb6143939e88e3c8b0cb760001b612769565b600280811115611f4e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff166002811115611f94577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b141561202b57611fc67f67184f01cd5dee1f924e1edd034c695290570bfe9ff2031cd3cdf65c487181f760001b612769565b611ff27f9d6c19369e9cee4b0edd541971abc34b144a7d581ea95e2f63adad445b7e594760001b612769565b61201e7f4de1d790c2b5a6c4efd4e0bb47803157d57b1d059f3daa8896b39b9f3a8b9d3e60001b612769565b612026612f07565b612058565b6120577f595287b4e37c39f3e33f0b5711e63ea8729c88b257f6c78d98dda02516e4b46760001b612769565b5b5b5b6120867f6c8f61b8bbc7ef0e2c7e8c9f7ca007f90653c61315bfd2b80a502c237f76b84c60001b612769565b6120b27f2ef20fbc1815f3cdf9fdb71074c981c2c34a888f86534bd28e528af796252ed160001b612769565b34600160008282546120c4919061388b565b925050819055506120f77f3ad9169dcd6e8ac93cb059ec3d4c3953e4116ce4d0739ec0e766ee57bac1898c60001b612769565b6121237fcd81eb53dde27b3e0ecab15fc9641e750971f6e9edb359c4b5643310f0e1114060001b612769565b3373ffffffffffffffffffffffffffffffffffffffff167f42c963aa35f443deec479d572afc5e7537393e1c348bc0fa2c0a4b86ff85204a3460008054906101000a900460ff1660015460405161217c93929190613838565b60405180910390a2565b60036020528060005260406000206000915054906101000a900460ff1681565b6121d27f1aad09ca593096ccd09193e5ae068dfe451715f118a0cf3930ddd469db412c4660001b612769565b6121fe7f75ee7141dba9e056b5e90b27a3e3435ee96e1c41daa7f2492f24f96ed0e9bf1b60001b612769565b61222a7fc09c616a36352ba32dcbbcda84c64f35a6dfd8fd5f1431fed3827b7143e51fc860001b612769565b6122567f6741da2c4ba357ef47b49cdafc7afb43d7e2b01473939543df0e62b226e5346a60001b612769565b60028081111561228f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff1660028111156122d5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14612315576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161230c9061375d565b60405180910390fd5b6123417f23358175aeb9172f8a75f881a1a96c412cc341937d7bcce31fc737093483819c60001b612769565b61236d7f746e207063e072271faca5cc2db5b2897537973108a91d7a1cd4c7922656995f60001b612769565b6123997f2e5517587661963ed3167206a461ef75bcbd68744c9f45770c7b3d99770bcffa60001b612769565b6123c57fd52a34fad8354a946679b240ac3f5251c852a2eb46b6d41951cc569ce331897b60001b612769565b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411612447576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161243e906137bd565b60405180910390fd5b6124737f7c329929f5ec76038011bbef43f2f4b57eb6f5ae64e53966a65ee0c6945d0d9d60001b612769565b61249f7fe41e78a853b3379802d763e19489de58605a8243896335c7efb34e9bb653452860001b612769565b6124cb7f8368865f7cb0bc36735613ddf25fd3e6e42e9ae83d62d9341506b4c3c377feb560001b612769565b60006005600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461251991906138e1565b90506125477f76eafa1cd35cffd9cd705ebaeb172236f33631d9057ba329490c0dcc5535aeb460001b612769565b6125737fde7e94fd0af93295b878fb36652184def7107f2ca648040a7d6f0d3b4841530c60001b612769565b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506125e47fa9577b6fd57c75cef676e01e46299f0fbba75f372149babf2b642040d5807be060001b612769565b6126107f303a3dcb376580f75ce2e859d286d0281fd50c423430eafbf55aa4d4313a0fd560001b612769565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b815260040161266d9291906135fe565b602060405180830381600087803b15801561268757600080fd5b505af115801561269b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906126bf919061334e565b506126ec7f24584fe70829b1091ecc9234455ca00fcf5ac2440fe2d05b4c56423f91b36f7f60001b612769565b6127187f3af57db61b4f614a4ce8a52f2e86aca67bb3643f6385ba34d4a44991af6331f560001b612769565b3373ffffffffffffffffffffffffffffffffffffffff167fc853d9a2751439bd161eba259f490c07a92e038e59bb1e00b02216522e17b0f78260405161275e919061381d565b60405180910390a250565b50565b6127987f5193d42076e713cf0a63917d4395e77ea11f58ac26e1e07f6a414cdb40dd953f60001b612769565b6127c47f0d466ecdc03f154687215e6ed915145adcb92889ae11e3e2303e87b62fcc3a7360001b612769565b6127f07ff514b90621d359ab3cc9c9a62b5ead73998cd79ed8539c15f1ffc803bb1b158c60001b612769565b61281c7f3e01451fd8a1c30985429f0f239aef338a2107247c802d63eba7d0ec8918d4cd60001b612769565b60011515600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515146128af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016128a69061377d565b60405180910390fd5b6128db7fe9312889e30ef2c345c965401e3e878196f6496bdc18805ba22f1440eb1b8e1460001b612769565b6129077f6e7c43ebf4dda499248ed5bae2f79f5610e6916a38e8563d6daa81d929d5613560001b612769565b6129337fad9f08229264c4c229b300acff4040c43b22d02f5de1a8528e023f9bd019a07660001b612769565b61295f7fdf1a426a4a673b597f4689ff6c3527be4dd6532b0b736eacee280e9fba1d100760001b612769565b685150ae84a8cdf0000034600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546129b4919061388b565b11156129f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016129ec9061379d565b60405180910390fd5b612a217f0f82818b600b2289a62d5fb26e75ae4473a370f775fd723c1f9138f61e0e245c60001b612769565b612a4d7f21a9c94c19d9bbeca7782bd1a47b2c0e292b3efda30037cf69d26dfdbb2a8d6660001b612769565b612a797f6ba218b6a43c0941d24bcbf9d81eee6823dd9873d4910d235e3c34bf09dfad7560001b612769565b612aa57f4719cbbeb30dcd957cf18c03cbbdf47254455764d837bd933f0206c21a1f69f760001b612769565b69032d26d12e980b60000034600154612abe919061388b565b1115612aff576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612af69061373d565b60405180910390fd5b612b2b7f143fc674cd60118eaae09fb5777c106a27b6e63bac70a28f07340c9f7e533ba360001b612769565b612b577fec90ac6bab5a923f5a2603fe84b07390a1c9d6a1b99816daccac08e3ba80c84760001b612769565b612b837f97829040c9fcf50de8c24220fe8a336199c40b48eec618dd00d7f14c0d1fab3560001b612769565b34600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254612bd2919061388b565b92505081905550565b612c077f02977425c9aa294bb8b79e6c38a1fed9b44b787d59bc9656875b79cbf6f81b2260001b612769565b612c337fe761162f64c09f018472c073291f8fab9c24eae7101211ddf401319d21f504a860001b612769565b612c5f7f69b3e286309052388a0dad2760a6c8309c51a6d7d2eb25707d552112e00f3b5b60001b612769565b612c8b7fa0806c3c346465ac37e0d221e89b6d1117878263655687aea4cd1bbb28a95c5660001b612769565b683635c9adc5dea0000034600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054612ce0919061388b565b1115612d21576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612d18906136dd565b60405180910390fd5b612d4d7f9ed487c93e3b2665917f6a0692b09b950830c202b0ed1d6a1952c443e58e628460001b612769565b612d797f82dafc70959d577ee0f6f67f6b7a29637b932aae5c3983a9542c7c0cd412b2a860001b612769565b612da57f711d42d7cd8fa248da87e7bede5fbdf6f738db304f9cd1a90df431eeb978e00460001b612769565b612dd17fe485b254e05d27d8e8c4cd730916bc6424ce730f08151926b8b4d2cf51f93bee60001b612769565b69065a4da25d3016c0000034600154612dea919061388b565b1115612e2b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612e229061371d565b60405180910390fd5b612e577f90917a78e5f0a8ec8907f352879d1e2db100e8538a70700495c557b82a1854b860001b612769565b612e837fe2d447548d7813fbdd6080df679c3d98bf6d7d0324064264318d87f23ccbdf4560001b612769565b612eaf7fb7bdc36f440d6db665a610168cdea1be3ac1afe38acd2475b48415e46809fa8d60001b612769565b34600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254612efe919061388b565b92505081905550565b612f337f65a9ec69b2085468fcbc8dddd71be0c85f679f8cbc6ab09126e11c1f0d297daf60001b612769565b612f5f7f02f05bba821d0699bb3da91b33822f0ef6ee57f69dc1429a910d42d66b9e20c960001b612769565b612f8b7fd3654c2e781a6a64ae55c3d61db19a2d10ca39181eb330b8e65057fbbb143be360001b612769565b612fb77f566eeb29d5149b6750f48bc087c8cfeb49f4f629b27433ce33d3cfd8865154ee60001b612769565b69065a4da25d3016c0000034600154612fd0919061388b565b1115613011576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016130089061365d565b60405180910390fd5b61303d7fdcc561a71ebe7c6f6b20b55d469a21e2ecb713b91f25bb23f960aa233fcd352860001b612769565b6130697f350940b87d0e9d866e3943db5eba9855300c07ddd3266471072eaa47afc8709960001b612769565b6130957faade76ab693e321d197d47db8e21984c60ab19409cd57e0b8d49e8861f2ab12860001b612769565b60006005346130a491906138e1565b90506130d27fb63dca5ecd57e10b67cc6adc1d0f2e0388a0fcea6285be73152f1f9cb352e2dc60001b612769565b6130fe7fe16bfc5f6cf0a4b8f9715a5cf0f72e87725124a8ba357fcde7c1565d87c1cd0b60001b612769565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b815260040161315b9291906135fe565b602060405180830381600087803b15801561317557600080fd5b505af1158015613189573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906131ad919061334e565b506131da7fb844db45bd0829fedc7ecc8652379ca77dcf3b130a44f9f04bc481bcfb4596cc60001b612769565b6132067fbabb697f67b34a7390ddc49e5175256dc7d73c11380b56fd190852d6d862661460001b612769565b3373ffffffffffffffffffffffffffffffffffffffff167fc853d9a2751439bd161eba259f490c07a92e038e59bb1e00b02216522e17b0f78260405161324c919061381d565b60405180910390a250565b60008135905061326681613d3c565b92915050565b60008083601f84011261327e57600080fd5b8235905067ffffffffffffffff81111561329757600080fd5b6020830191508360208202830111156132af57600080fd5b9250929050565b6000815190506132c581613d53565b92915050565b6000813590506132da81613d6a565b92915050565b6000602082840312156132f257600080fd5b600061330084828501613257565b91505092915050565b6000806020838503121561331c57600080fd5b600083013567ffffffffffffffff81111561333657600080fd5b6133428582860161326c565b92509250509250929050565b60006020828403121561336057600080fd5b600061336e848285016132b6565b91505092915050565b60006020828403121561338957600080fd5b6000613397848285016132cb565b91505092915050565b6133a98161393b565b82525050565b6133b88161394d565b82525050565b6133c781613996565b82525050565b60006133da603a8361387a565b91506133e582613a4f565b604082019050919050565b60006133fd60148361387a565b915061340882613a9e565b602082019050919050565b600061342060168361387a565b915061342b82613ac7565b602082019050919050565b600061344360128361387a565b915061344e82613af0565b602082019050919050565b600061346660368361387a565b915061347182613b19565b604082019050919050565b6000613489601e8361387a565b915061349482613b68565b602082019050919050565b60006134ac603d8361387a565b91506134b782613b91565b604082019050919050565b60006134cf60168361387a565b91506134da82613be0565b602082019050919050565b60006134f260198361387a565b91506134fd82613c09565b602082019050919050565b600061351560188361387a565b915061352082613c32565b602082019050919050565b600061353860268361387a565b915061354382613c5b565b604082019050919050565b600061355b60138361387a565b915061356682613caa565b602082019050919050565b600061357e60138361387a565b915061358982613cd3565b602082019050919050565b60006135a160008361386f565b91506135ac82613cfc565b600082019050919050565b60006135c460168361387a565b91506135cf82613cff565b602082019050919050565b6135e38161398c565b82525050565b60006135f482613594565b9150819050919050565b600060408201905061361360008301856133a0565b61362060208301846135da565b9392505050565b600060208201905061363c60008301846133af565b92915050565b600060208201905061365760008301846133be565b92915050565b60006020820190508181036000830152613676816133cd565b9050919050565b60006020820190508181036000830152613696816133f0565b9050919050565b600060208201905081810360008301526136b681613413565b9050919050565b600060208201905081810360008301526136d681613436565b9050919050565b600060208201905081810360008301526136f681613459565b9050919050565b600060208201905081810360008301526137168161347c565b9050919050565b600060208201905081810360008301526137368161349f565b9050919050565b60006020820190508181036000830152613756816134c2565b9050919050565b60006020820190508181036000830152613776816134e5565b9050919050565b6000602082019050818103600083015261379681613508565b9050919050565b600060208201905081810360008301526137b68161352b565b9050919050565b600060208201905081810360008301526137d68161354e565b9050919050565b600060208201905081810360008301526137f681613571565b9050919050565b60006020820190508181036000830152613816816135b7565b9050919050565b600060208201905061383260008301846135da565b92915050565b600060608201905061384d60008301866135da565b61385a60208301856133be565b61386760408301846135da565b949350505050565b600081905092915050565b600082825260208201905092915050565b60006138968261398c565b91506138a18361398c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156138d6576138d56139f1565b5b828201905092915050565b60006138ec8261398c565b91506138f78361398c565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156139305761392f6139f1565b5b828202905092915050565b60006139468261396c565b9050919050565b60008115159050919050565b600081905061396782613d28565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006139a182613959565b9050919050565b60006139b38261398c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156139e6576139e56139f1565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f546f74616c204f70656e20506861736520436f6e747269627574696f6e73206d60008201527f757374206265206c657373207468616e2033306b206574686572000000000000602082015250565b7f436f6e747269627574696f6e7320506175736564000000000000000000000000600082015250565b7f556e7375636365737366756c2077697468647261776c00000000000000000000600082015250565b7f416c7265616479205068617365204f70656e0000000000000000000000000000600082015250565b7f47656e6572616c20506861736520436f6e747269627574696f6e73206d75737460008201527f206265206c657373207468616e20316b20657468657200000000000000000000602082015250565b7f5370616365436f696e20436f6e747261637420416c7265616479205365740000600082015250565b7f546f74616c2047656e6572616c20506861736520436f6e747269627574696f6e60008201527f73206d757374206265206c657373207468616e2033306b206574686572000000602082015250565b7f536565642046756e642043617020457863656564656400000000000000000000600082015250565b7f49434f206e6f742079657420696e206f70656e20706861736500000000000000600082015250565b7f496e766573746f72206e6f742077686974656c69737465640000000000000000600082015250565b7f536565642066756e64206d757374206265206c657373207468616e20312e356b60008201527f2065746865720000000000000000000000000000000000000000000000000000602082015250565b7f4e6f20746f6b656e7320746f2072656465656d00000000000000000000000000600082015250565b7f5265717569726573204f6e6c79204f776e657200000000000000000000000000600082015250565b50565b7f496e636f7272657420506861736520416476616e636500000000000000000000600082015250565b60038110613d3957613d38613a20565b5b50565b613d458161393b565b8114613d5057600080fd5b50565b613d5c8161394d565b8114613d6757600080fd5b50565b60038110613d7757600080fd5b5056fea2646970667358221220798066be419c3c3023b5827206d4ae5ed37bc311f91ac7b8e176d0564efc751064736f6c63430008040033";

type SpaceCoinICOConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SpaceCoinICOConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SpaceCoinICO__factory extends ContractFactory {
  constructor(...args: SpaceCoinICOConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _treasury: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SpaceCoinICO> {
    return super.deploy(_treasury, overrides || {}) as Promise<SpaceCoinICO>;
  }
  override getDeployTransaction(
    _treasury: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_treasury, overrides || {});
  }
  override attach(address: string): SpaceCoinICO {
    return super.attach(address) as SpaceCoinICO;
  }
  override connect(signer: Signer): SpaceCoinICO__factory {
    return super.connect(signer) as SpaceCoinICO__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SpaceCoinICOInterface {
    return new utils.Interface(_abi) as SpaceCoinICOInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SpaceCoinICO {
    return new Contract(address, _abi, signerOrProvider) as SpaceCoinICO;
  }
}