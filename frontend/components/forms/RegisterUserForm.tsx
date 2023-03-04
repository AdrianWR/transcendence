import { Group, PasswordInput, Stack, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { HttpStatusCode } from "axios";
import { FormEvent } from "react";
import axiosPrivate from "../../lib/api/axios";

type RegisterUserFormType = {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  confirm_password: string
}

type CreateUserDto = {
  email: string,
  first_name: string,
  last_name: string,
  password: string
}

const alertNotification = (title: string, message: string) => {
  showNotification({
    title: title, message: message, color: "red", icon: <IconX />
  });
}

const successNotification = (title: string, message: string) => {
  showNotification({
    title: title, message: message, color: "green", icon: <IconCheck />
  });
}

const handleSubmit = async (values: RegisterUserFormType, event: FormEvent) => {
  event.preventDefault();
  const register_uri = '/auth/local/signup';
  const payload: CreateUserDto = {
    email: values.email,
    first_name: values.first_name,
    last_name: values.last_name,
    password: values.password,
  };

  console.log(payload);

  try {
    const response = await axiosPrivate.post(register_uri,
      JSON.stringify(payload),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )
    successNotification("Success!", "Your user was registered successfully.")
  } catch (err) {
    if (!err?.response) {
      alertNotification("No Server Response", "Please try again in a few seconds.")
    } else if (err.response?.status === HttpStatusCode.Conflict) {
      alertNotification("Email already registered", "Please log in to your account.")
    } else {
      alertNotification("Registration failed", "Please try again in a few seconds.")
      console.error(err.response);
    }
  }
}


export const RegisterUserForm = ({ submitRef }) => {

  const form = useForm<RegisterUserFormType>(
    {
      initialValues: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
      },

      validate: {
        email: isEmail('Invalid email'),
        confirm_password: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
      },

      validateInputOnChange: true,
    });

  return (
    <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
      <Stack>
        <Group position="center" spacing="xs" grow={true}>
          <TextInput
            withAsterisk
            label="First Name"
            placeholder=""
            {...form.getInputProps('first_name')}
          />

          <TextInput
            withAsterisk
            label="Last Name"
            placeholder=""
            {...form.getInputProps('last_name')}
          />
        </Group>

        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps('password')}
        />

        <PasswordInput
          withAsterisk
          label="Confirm Password"
          placeholder="Your password"
          required
          {...form.getInputProps('confirm_password')}
        />
      </Stack>
      <button ref={submitRef} type="submit" style={{ display: 'none' }} />
    </form>
  );
}

export default { RegisterUserForm };