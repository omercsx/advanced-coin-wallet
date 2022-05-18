export interface ICrypto {
  id: string;
  _id: string;
  walletId: string;
  exchangeId: string;
  symbol: string;
  amount: number;
  firstPrice: number;
  lastPrice: number;
  createdAt: string;
  updatedAt: string;
  exchange: IExchange;
}

export enum ExchangeNames {
  Binance = "Binance",
  KuCoin = "KuCoin",
}

export interface IExchange {
  _id: string;
  name: ExchangeNames;
  baseApi: string;
  symbolListEndpoint: string;
  priceEndpoint: string;
  logoUrl: string;
}

export interface IWallet {
  _id: string;
  id: string;
  cryptoIds: string[];
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  recurringJobId: string;
  cryptos: ICrypto[];
}
