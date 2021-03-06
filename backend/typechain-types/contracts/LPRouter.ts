/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface LPRouterInterface extends utils.Interface {
  functions: {
    "addLiquidity(uint256,uint256,uint256,uint256)": FunctionFragment;
    "spaceCoin()": FunctionFragment;
    "spaceCoinICO()": FunctionFragment;
    "spce_eth_pair()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addLiquidity"
      | "spaceCoin"
      | "spaceCoinICO"
      | "spce_eth_pair"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "spaceCoin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "spaceCoinICO",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "spce_eth_pair",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "spaceCoin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "spaceCoinICO",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "spce_eth_pair",
    data: BytesLike
  ): Result;

  events: {
    "AddLiquidity(uint256,uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddLiquidity"): EventFragment;
}

export interface AddLiquidityEventObject {
  optimalEth: BigNumber;
  optimalSpce: BigNumber;
  to: string;
}
export type AddLiquidityEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  AddLiquidityEventObject
>;

export type AddLiquidityEventFilter = TypedEventFilter<AddLiquidityEvent>;

export interface LPRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LPRouterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addLiquidity(
      ethDesired: BigNumberish,
      spceDesired: BigNumberish,
      ethMinimum: BigNumberish,
      spceMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    spaceCoin(overrides?: CallOverrides): Promise<[string]>;

    spaceCoinICO(overrides?: CallOverrides): Promise<[string]>;

    spce_eth_pair(overrides?: CallOverrides): Promise<[string]>;
  };

  addLiquidity(
    ethDesired: BigNumberish,
    spceDesired: BigNumberish,
    ethMinimum: BigNumberish,
    spceMinimum: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  spaceCoin(overrides?: CallOverrides): Promise<string>;

  spaceCoinICO(overrides?: CallOverrides): Promise<string>;

  spce_eth_pair(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addLiquidity(
      ethDesired: BigNumberish,
      spceDesired: BigNumberish,
      ethMinimum: BigNumberish,
      spceMinimum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        optimalEth: BigNumber;
        optimalSpce: BigNumber;
        tokensCreated: BigNumber;
      }
    >;

    spaceCoin(overrides?: CallOverrides): Promise<string>;

    spaceCoinICO(overrides?: CallOverrides): Promise<string>;

    spce_eth_pair(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AddLiquidity(uint256,uint256,address)"(
      optimalEth?: null,
      optimalSpce?: null,
      to?: null
    ): AddLiquidityEventFilter;
    AddLiquidity(
      optimalEth?: null,
      optimalSpce?: null,
      to?: null
    ): AddLiquidityEventFilter;
  };

  estimateGas: {
    addLiquidity(
      ethDesired: BigNumberish,
      spceDesired: BigNumberish,
      ethMinimum: BigNumberish,
      spceMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    spaceCoin(overrides?: CallOverrides): Promise<BigNumber>;

    spaceCoinICO(overrides?: CallOverrides): Promise<BigNumber>;

    spce_eth_pair(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidity(
      ethDesired: BigNumberish,
      spceDesired: BigNumberish,
      ethMinimum: BigNumberish,
      spceMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    spaceCoin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    spaceCoinICO(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    spce_eth_pair(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
