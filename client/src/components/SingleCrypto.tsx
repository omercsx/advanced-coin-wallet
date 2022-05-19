import { useState } from "react";
import { Menu, NumberInput, Text } from "@mantine/core";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

import axios from "../api/axios";
import useWallet from "../hooks/useWallet";
import { ACTIONS } from "../providers/WalletProvider";

interface IProps {
  id: string;
  symbol: string;
  amount: number;
  lastPrice: number;
  exchangeName: string;
  exchangeLogo: string;
}
export const SingleCrypto = ({ id, symbol, amount, lastPrice, exchangeName, exchangeLogo }: IProps) => {
  const [openAmount, setOpenAmount] = useState(false);
  const { state: wallet, dispatch: walletDispatch } = useWallet();
  const [value, setValue] = useState<number | undefined>(amount);
  const handleEdit = async (cryptoId: string, newAmount: number | undefined) => {
    try {
      const response = await axios.patch(`/userCrypto/${cryptoId}`, { newAmount: newAmount });
      console.log(response);
      if (response.status === 200) {
        walletDispatch({
          type: ACTIONS.DELETE_COIN,
          payload: {
            data: {
              balance: lastPrice * amount,
              id: id,
            },
          },
        });

        walletDispatch({
          type: ACTIONS.ADD_COIN,
          payload: {
            message: response.data.message,
            data: {
              balance: response.data.data.amount * response.data.data.lastPrice,
              newUserCrypto: response.data.data,
            },
          },
        });

        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (cryptoId: string) => {
    try {
      const response = await axios.delete(`/userCrypto/${cryptoId}`);
      if (response.status === 204) {
        walletDispatch({
          type: ACTIONS.DELETE_COIN,
          payload: {
            data: {
              balance: lastPrice * amount,
              id: id,
            },
          },
        });

        toast.success("Crypto deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={
        openAmount
          ? "flex w-full gap-4 items-center justify-between bg-yellow-900 px-1"
          : "flex w-full gap-4 items-center justify-between px-1"
      }
    >
      <img src={exchangeLogo} alt={exchangeName} className='rounded-full h-12' />
      <Text>{symbol}</Text>
      {!openAmount ? (
        <Text>{amount}</Text>
      ) : (
        <NumberInput hideControls className='w-14' size='xs' required value={value} onChange={(val) => setValue(val)} />
      )}
      <Text>{lastPrice.toFixed(2)}</Text>
      <Text>{(lastPrice * amount).toFixed(2)}</Text>
      <Menu trigger='hover' delay={300}>
        <Menu.Item
          icon={<MdDeleteOutline size={"1.2rem"} />}
          className='hover:bg-red-500 text-red-500 hover:text-white'
          onClick={() => handleDelete(id)}
        >
          <Text size='sm' weight='bold'>
            Delete Asset
          </Text>
        </Menu.Item>
        {openAmount ? (
          <Menu.Item
            icon={<MdOutlineEdit size={"1.2rem"} />}
            className='hover:bg-yellow-500 text-yellow-500 hover:text-white'
            onClick={() => {
              setOpenAmount(false);
              handleEdit(id, value);
            }}
          >
            <Text size='sm' weight='bold'>
              Update Asset
            </Text>
          </Menu.Item>
        ) : (
          <Menu.Item
            icon={<MdOutlineEdit size={"1.2rem"} />}
            className='hover:bg-yellow-500 text-yellow-500 hover:text-white'
            onClick={() => {
              setOpenAmount(true);
            }}
          >
            <Text size='sm' weight='bold'>
              Edit Mode
            </Text>
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};
