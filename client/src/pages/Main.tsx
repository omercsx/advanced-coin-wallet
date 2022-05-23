import { useEffect } from "react";
import moment from "moment";
import axios from "../api/axios";
import { Card, Loader, Modal, NumberInput, Select, Text } from "@mantine/core";
import { ResponsiveLine } from "@nivo/line";
import { BiDollar } from "react-icons/bi";

import useWallet from "../hooks/useWallet";
import useAuth from "../hooks/useAuth";
import useExchanges from "../hooks/useExchanges";
import useDashboard from "../hooks/useDashboard";
import { SingleCrypto } from "../components/SingleCrypto";
import { ACTIONS as WALLET_ACTIONS } from "../providers/WalletProvider";
import { ACTIONS as Exchange_ACTIONS } from "../providers/ExchangeProvider";
import { ACTIONS as Dashboard_ACTIONS } from "../providers/DashboardProvider";
import { ACTIONS as Auth_ACTIONS } from "../providers/AuthProvider";
import { IExchange, IWalletHistory } from "../types";
import { useForm } from "@mantine/form";
import toast, { Toaster } from "react-hot-toast";

export const Main = () => {
  const { state: wallet, dispatch: walletDispatch } = useWallet();
  const { state: authState, dispatch: authDispatch } = useAuth();
  const { state: dashboard, dispatch: dashboardDispatch } = useDashboard();
  const { state: exchange, dispatch: exchangeDispatch } = useExchanges();
  useEffect(() => {
    const getWallet = async () => {
      const exchangeResponse = await axios.get("/exchange");
      const response = await axios.get("/wallet");
      const dashboardResponse = await axios.get("/wallet/dashboard");
      if (response?.status === 200 && response?.data?.status) {
        walletDispatch({ type: WALLET_ACTIONS.FETCH_WALLET, payload: response?.data });
      }
      if (dashboardResponse?.status === 200 && response?.data?.status) {
        dashboardDispatch({ type: Dashboard_ACTIONS.FETCH_WALLET_HISTORY, payload: dashboardResponse?.data });
      }
      if (exchangeResponse?.status === 200 && response?.data?.status) {
        exchangeDispatch({ type: Exchange_ACTIONS.FETCH_EXCHANGES, payload: exchangeResponse?.data });
      }
    };
    getWallet();
  }, [authState]);

  //moment(item?.eventDate).format("DD/MM").toString()
  const walletValueHistory: any = [];
  const walletMaxValueHistory: any = [];
  const walletMinValueHistory: any = [];
  dashboard?.data?.map((item: IWalletHistory) => {
    walletMaxValueHistory.push({
      y: item?.maxValue,
      x: moment(item?.eventDate).format("MM/DD/HH").toString(),
    });
    walletValueHistory.push({
      y: item?.value,
      x: moment(item?.eventDate).format("MM/DD/HH").toString(),
    });
    walletMinValueHistory.push({
      y: item?.minValue,
      x: moment(item?.eventDate).format("MM/DD/HH").toString(),
    });
  });

  const data = [
    {
      id: "Max Value",
      color: "hsl(356, 100%, 100%)",
      data: walletMaxValueHistory,
    },
    {
      id: "Average Value",
      color: "hsl(294, 70%, 50%)",
      data: walletValueHistory,
    },
    {
      id: "Min Value",
      color: "hsl(30, 70%, 50%)",
      data: walletMinValueHistory,
    },
  ];

  // Add Crypto form
  const form = useForm({
    initialValues: { exchange: "", crypto: "", amount: 0 },
    validate: {
      exchange: (value) => (value === "Binance" || "KuCoin" ? null : "Invalid exchange"),
      crypto: (value) => (value ? null : "Crypto is required"),
      amount: (value) => (value > 0 ? null : "Amount is required and must be greater than 0"),
    },
  });

  const handleSubmit = async (values: { exchange: string; crypto: string; amount: number }) => {
    try {
      const response = await axios.post("userCrypto", {
        exchangeName: values.exchange,
        symbol: values.crypto,
        amount: values.amount,
      });
      if (response?.status === 200 && response?.data?.status) {
        walletDispatch({ type: WALLET_ACTIONS.ADD_COIN, payload: response?.data });
        authDispatch({ type: Auth_ACTIONS.MODAL_SWITCH, payload: null });
        toast.success(response?.data?.message, { duration: 3000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exchangeList = exchange?.data?.map((item: IExchange) => item.name);

  const coinList =
    form.values.exchange === "Binance"
      ? exchange?.data?.filter((item: any) => item?.name === "Binance")[0].symbols
      : exchange?.data?.filter((item: any) => item?.name === "KuCoin")[0].symbols;

  return (
    <div className='flex flex-col-reverse md:flex-row py-6 px-4 justify-between gap-4'>
      <Toaster position='top-right' reverseOrder={false} />
      <Modal
        opened={authState.modalOpen}
        onClose={() => authDispatch({ type: Auth_ACTIONS.MODAL_SWITCH })}
        title='Add new Crypto Asset'
      >
        <form
          className='flex flex-col w-full max-w-lg px-8 py-10 space-y-5 bg-peyk-600'
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <Select
            label='Select Your Exchange'
            placeholder='Select Your Exchange'
            allowDeselect
            clearable
            required
            data={exchangeList ? exchangeList : []}
            {...form.getInputProps("exchange")}
          />

          <Select
            label='Select Your Coin'
            placeholder='Select Your Coin'
            allowDeselect
            clearable
            searchable
            required
            data={coinList ? coinList : []}
            {...form.getInputProps("crypto")}
          />

          <NumberInput
            defaultValue={0}
            placeholder='Amount'
            label='Amount'
            min={0}
            required
            {...form.getInputProps("amount")}
          />

          <button className='px-8 py-2 bg-green-600 rounded-md hover:bg-green-900' type='submit'>
            <Text className='font-sans font-medium'>Add</Text>
          </button>
        </form>
      </Modal>
      <div className='flex flex-col w-full md:w-3/5 gap-10'>
        <Card className='h-96 w-12/12' p={"xs"} shadow='sm' radius={"lg"}>
          <ResponsiveLine
            data={data}
            enableGridX={false}
            enableGridY={false}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=' >-.2f'
            pointSize={10}
            theme={{
              textColor: "#FFFFFF",
            }}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 0,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 20,
                itemsSpacing: 4,
                symbolSize: 20,
                symbolShape: "circle",
                itemDirection: "left-to-right",
                itemTextColor: "#777",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            tooltip={function (e: any) {
              let item = e?.point;
              return (
                <div className='flex flex-col items-center bg-peyk-600 shadow rounded px-2 py-1 text-white border'>
                  <p>date: {item?.data.x.replace("-", "/").split("T")[0]}</p>
                  <p>balance: {item?.data.y}</p>
                </div>
              );
            }}
          />
        </Card>
      </div>
      <div className='flex flex-col justify-start w-full md:w-2/5 gap-4 items-end'>
        <Card className='w-full h-max' p={"xl"} shadow='sm' radius={"lg"}>
          <div className='flex flex-col gap-4 items-center'>
            <Text className='text-sm'>Total Balance</Text>
            <div className='flex items-center gap-2'>
              <BiDollar size={"2rem"} />
              <Text className='text-4xl'>{wallet?.status ? wallet?.data?.balance.toFixed(2) : <Loader />}</Text>
            </div>
          </div>
        </Card>
        <Card className=' h-max flex flex-col items-center gap-5 w-full' p={"xl"} shadow='sm' radius={"lg"}>
          <Text size='xl'>User's Assets</Text>
          {wallet?.status ? (
            wallet?.data?.cryptos?.map?.((crypto) => (
              <SingleCrypto
                key={crypto?.id}
                id={crypto?.id}
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
