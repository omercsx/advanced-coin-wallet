import { useForm } from "@mantine/form";
import { PasswordInput, TextInput, Text, Card } from "@mantine/core";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { ACTIONS } from "../providers/AuthProvider";

export const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleSubmit = async (email: string, fullName: string, password: string) => {
    try {
      const data = { email: email, fullName: fullName, password: password };
      const response = await axios.post("/auth/register", data);

      if (response?.status === 201 && response?.data?.status) {
        toast.success(response?.data?.message, { duration: 3000 });
        navigate("/login");
      } else {
        dispatch({ type: ACTIONS.USER_LOGGED_OUT });
        toast.error("Register failed");
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
    initialValues: { email: "", fullName: "", password: "", confirmPassword: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      fullName: (value) => (value.length > 0 ? null : "Full name is required"),
      password: (value: string) => (value.length > 4 ? null : "Password must be at least 4 characters"),
      confirmPassword: (value, values) => (value !== values.password ? "Passwords did not match" : null),
    },
  });
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Toaster position='top-right' reverseOrder={false} />
      <form
        className='flex flex-col w-full max-w-lg px-8 py-10 space-y-5 bg-peyk-600'
        onSubmit={form.onSubmit((values) => handleSubmit(values?.email, values?.fullName, values?.password))}
      >
        <Card shadow='sm' p='xl'>
          <Card.Section p='xl' className='flex w-full items-center justify-center'>
            <Text size='xl'>Good choice 🎉, let's start!</Text>
          </Card.Section>
          <Card.Section p='xl'>
            <TextInput required size='lg' label='Email' placeholder='your@email.com' {...form.getInputProps("email")} />
          </Card.Section>
          <Card.Section p='xl'>
            <TextInput
              required
              size='lg'
              label='Full Name'
              placeholder='Your full name'
              {...form.getInputProps("fullName")}
            />
          </Card.Section>
          <Card.Section p='xl'>
            <div className='flex flex-col gap-8'>
              <PasswordInput
                label='Password'
                size='lg'
                required
                placeholder='********'
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label='Confirm Password'
                size='lg'
                required
                placeholder='********'
                {...form.getInputProps("confirmPassword")}
              />
            </div>
          </Card.Section>
          <Card.Section p='xl'>
            <div className='flex w-full justify-between items-center'>
              <Text size='sm'>
                Do you have an account? Click{" "}
                <Link to='/login' className='text-blue-400 hover:text-blue-600'>
                  here
                </Link>
              </Text>
              <button className='px-8 py-2 bg-blue-900 rounded-md hover:bg-slate-900' type='submit'>
                Register
              </button>
            </div>
          </Card.Section>
        </Card>
      </form>
    </div>
  );
};
