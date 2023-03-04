import { PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormEvent } from "react";

type LoginUserFormType = {
  username: string,
  password: string
}

const handleSubmit = async (values: LoginUserFormType, event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  const JSONdata = JSON.stringify(values)
  const endpoint = '/api/auth/local'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
  }

  const response = await fetch(endpoint, options)

  const result = await response.json()
  console.log(`Is this your full name: ${result.data}`)
}

export const LoginUserForm = () => {
  const form = useForm<LoginUserFormType>({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
      <Stack>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('username')}
        />

        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps('password')}
        />

      </Stack>
    </form>
  )
}

