import { Box, Button, Checkbox, Container, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const Login = () => {
  const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  })

  return (
    <Container>
      <Box sx={{ maxWidth: 300 }} mx="auto" p="xs">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />
          <PasswordInput
          />
          <Checkbox
            mt="md"
            label="I agree to sell my privacy"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Container>
  )
}

export default Login;