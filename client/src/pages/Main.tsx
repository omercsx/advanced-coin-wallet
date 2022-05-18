import { Card, Loader, Text } from "@mantine/core";
import { useEffect } from "react";
import useWallet from "../hooks/useWallet";
import { BiDollar } from "react-icons/bi";
import axios from "../api/axios";
import { SingleCrypto } from "../components/SingleCrypto";

export const Main = () => {
  const { state: wallet, dispatch: walletDispatch } = useWallet();
  useEffect(() => {
    const getWallet = async () => {
      const response = await axios.get("/wallet");
      if (response?.status === 200 && response?.data?.status) {
        walletDispatch({ type: "FETCH_WALLET", payload: response?.data });
      }
    };
    getWallet();
  }, []);

  return (
    <div className='flex flex-col px-8 py-6'>
      <div className='flex w-full justify-between'>
        <Card className='w-max h-max' p={"xl"} shadow='sm' radius={"lg"}>
          <div className='flex flex-col gap-4'>
            <Text className='text-sm'>Total Balance</Text>
            <div className='flex items-center gap-2'>
              <BiDollar size={"2rem"} />
              <Text className='text-4xl'>{wallet?.status ? wallet?.data?.balance : <Loader />}</Text>
            </div>
          </div>
        </Card>
        <Card className='w-max flex flex-col items-center gap-5' p={"xl"} shadow='sm' radius={"lg"}>
          <Text size='xl'>User's Assets</Text>
          {wallet?.status ? (
            wallet?.data?.cryptos?.map?.((crypto) => (
              <SingleCrypto
                amount={crypto?.amount}
                exchangeLogo={crypto?.exchange?.logoUrl}
                exchangeName={crypto?.exchange?.name}
                lastPrice={crypto?.lastPrice}
                symbol={crypto?.symbol}
              />
            ))
          ) : (
            <Loader />
          )}
        </Card>
      </div>
    </div>
  );
};
