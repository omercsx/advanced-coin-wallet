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
  name: string;
  baseApi: string;
  symbolListEndpoint: string;
  priceEndpoint: string;
  logoUrl: string;
  symbols: string[];
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

export interface IWalletHistory {
  _id: string;
  eventDate: string;
  value: number;
  maxValue: number;
  minValue: number;
  walletId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
