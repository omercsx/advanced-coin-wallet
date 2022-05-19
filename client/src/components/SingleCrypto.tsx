import { Menu, Text } from "@mantine/core";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import axios from "../api/axios";

interface IProps {
  id: string;
  symbol: string;
  amount: number;
  lastPrice: number;
  exchangeName: string;
  exchangeLogo: string;
}
export const SingleCrypto = ({ id, symbol, amount, lastPrice, exchangeName, exchangeLogo }: IProps) => {
  const handleDelete = async (cryptoId: string) => {
    try {
      const response = await axios.delete(`/userCrypto/${cryptoId}`);
      if (response.status === 204) {
        toast.success("Crypto deleted successfully");
      }
    } catch (error) {}
  };

  return (
    <div className='flex w-full gap-4 items-center justify-between'>
      <img src={exchangeLogo} alt={exchangeName} className='rounded-full h-12' />
      <Text>{symbol}</Text>
      <Text>{amount}</Text>
      <Text>{lastPrice}</Text>
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
        <Menu.Item
          icon={<MdOutlineEdit size={"1.2rem"} />}
          className='hover:bg-yellow-500 text-yellow-500 hover:text-white'
          onClick={() => console.log("Hello")}
        >
          <Text size='sm' weight='bold'>
            Edit Asset
          </Text>
        </Menu.Item>
      </Menu>
    </div>
  );
};
