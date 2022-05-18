import { Text } from "@mantine/core";
import React from "react";

interface IProps {
  symbol: string;
  amount: number;
  lastPrice: number;
  exchangeName: string;
  exchangeLogo: string;
}
export const SingleCrypto = ({ symbol, amount, lastPrice, exchangeName, exchangeLogo }: IProps) => {
  return (
    <div className='flex w-full gap-4 items-center justify-between'>
      <img src={exchangeLogo} alt={exchangeName} className='rounded-full h-12' />
      <Text>{symbol}</Text>
      <Text>{amount}</Text>
      <Text>{lastPrice}</Text>
      <Text>{(lastPrice * amount).toFixed(2)}</Text>
    </div>
  );
};
