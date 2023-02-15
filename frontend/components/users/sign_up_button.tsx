import { Box, Button, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, FormEvent, useState } from "react";

type CreateUserFormType = {
  user: string,
  email: string,
  password: string
}

const handleSubmit = async (values: CreateUserFormType, event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  const JSONdata = JSON.stringify(values)
  const endpoint = '/api/users'

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

const UserCreateForm = () => {

  const form = useForm<CreateUserFormType>({
    initialValues: {
      user: '',
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
        <TextInput
          withAsterisk
          label="User"
          placeholder="User"
          {...form.getInputProps('user')}
        />

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

        <Group position="right" mt="md">
          <Button type="submit">Register</Button>
        </Group>
      </form>
    </Box>
  );
}

const SignUpButton: FC = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <UserCreateForm />
      </Modal>

      <Group position="center">
        <Button color="red" onClick={() => setOpened(true)}>Sign Up</Button>
      </Group>
    </>
  );
}

export default SignUpButton;