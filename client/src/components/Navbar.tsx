import { Text, Avatar, Menu } from "@mantine/core";
import { Link } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { BiRocket } from "react-icons/bi";
import { ACTIONS as AUTH_ACTIONS } from "../providers/AuthProvider";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { state: auth, dispatch: authDispatch } = useAuth();
  const navigate = useNavigate();
  let email = "";
  let fullName = "";
  email = auth?.user?.email;
  fullName = auth?.user?.fullName;

  // if there is 2 word split full name into first and last name and set initials

  const [firstName, lastName] = fullName?.split(" ");

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");

      if (response?.status === 204) {
        authDispatch({ type: AUTH_ACTIONS.USER_LOGGED_OUT, payload: null });
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='flex justify-center w-full p-4 border-b border-b-gray-600'>
      <div className='flex items-center justify-between w-full max-w-screen-xl 2xl:max-w-screen-3xl'>
        <div className='flex items-center'>
          <Link to='/' className='flex gap-3 items-center'>
            <BiRocket size={"2rem"} />
            <Text size='xl'>Coin Wallet</Text>
          </Link>
          <Link to='/' className='pl-4 ml-4 border-l border-peyk-400'>
            <Text size='sm'>Home</Text>
          </Link>
          <Link to='map' className='ml-4'>
            <Text size='sm'>Map</Text>
          </Link>
        </div>
        <div className='flex items-center space-x-4'>
          <Menu
            trigger='hover'
            delay={500}
            control={
              <Avatar src={null} alt={fullName} color='indigo'>
                {fullName?.includes(" ")
                  ? fullName?.split(" ")[0][0].toUpperCase() + fullName?.split(" ")[1][0].toUpperCase()
                  : fullName?.[0].toUpperCase()}
              </Avatar>
            }
          >
            <Menu.Label>User Informations</Menu.Label>
            <Menu.Item>
              <Text>{fullName}</Text>
            </Menu.Item>
            <Menu.Item>
              <Text> {email}</Text>
            </Menu.Item>
          </Menu>

          <button onClick={handleLogout} className='hover:text-red-400'>
            <AiOutlineLogout size={"1.4rem"} />
          </button>
        </div>
      </div>
    </div>
  );
};
