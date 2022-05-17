import { useForm } from "@mantine/form";
import { PasswordInput, TextInput, Text, Card } from "@mantine/core";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { ACTIONS } from "../providers/AuthProvider";

export const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const data = { email, password };
      const response = await axios.post("/auth/login", data);

      if (response?.status === 200 && response?.data?.status) {
        dispatch({ type: ACTIONS.USER_LOGGED_IN, payload: response?.data?.data });
        navigate("/");
      } else {
        dispatch({ type: ACTIONS.USER_LOGGED_OUT });
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      dispatch({ type: ACTIONS.USER_LOGGED_OUT });
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const form = useForm({
    initialValues: { email: "", password: "secret" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: string) => (value.length > 4 ? null : "Password must be at least 6 characters"),
    },
  });
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Toaster position='top-right' reverseOrder={false} />
      <form
        className='flex flex-col w-full max-w-lg px-8 py-10 space-y-5 bg-peyk-600'
        onSubmit={form.onSubmit((values) => handleSubmit(values?.email, values?.password))}
      >
        <Card shadow='sm' p='xl'>
          <Card.Section p='xl'>
            <Text size='xl'>Welcome to Coin Wallet Login Page</Text>
          </Card.Section>
          <Card.Section p='xl'>
            <TextInput required size='lg' label='Email' placeholder='your@email.com' {...form.getInputProps("email")} />
          </Card.Section>
          <Card.Section p='xl'>
            <PasswordInput
              label='Password'
              size='lg'
              required
              placeholder='Password'
              {...form.getInputProps("password")}
            />
          </Card.Section>
          <Card.Section p='xl'>
            <div className='flex w-full justify-between items-center'>
              <Text size='sm'>
                Don't you have an account? Click{" "}
                <Link to='/register' className='text-blue-400 hover:text-blue-600'>
                  here
                </Link>
              </Text>
              <button className='px-8 py-2 bg-blue-900 rounded-md hover:bg-slate-900' type='submit'>
                Login
              </button>
            </div>
          </Card.Section>
        </Card>
      </form>
    </div>
  );
};
