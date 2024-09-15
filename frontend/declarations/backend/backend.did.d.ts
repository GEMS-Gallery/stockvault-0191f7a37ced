import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Holding {
  'currentPrice' : number,
  'purchasePrice' : number,
  'name' : string,
  'sector' : string,
  'quantity' : number,
  'assetType' : string,
  'symbol' : string,
}
export interface Portfolio {
  'holdings' : Array<Holding>,
  'sectors' : Array<[string, number]>,
  'assetClasses' : Array<[string, number]>,
  'allocation' : Array<[string, number]>,
}
export interface _SERVICE {
  'addOrUpdateHolding' : ActorMethod<
    [string, string, number, number, number, string, string],
    undefined
  >,
  'getPortfolio' : ActorMethod<[], Portfolio>,
  'init' : ActorMethod<[], undefined>,
  'removeHolding' : ActorMethod<[string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
