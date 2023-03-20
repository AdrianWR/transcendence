/* eslint-disable */
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Group, Modal, PasswordInput, TextInput, Avatar, Checkbox, FileInput, FileButton } from '@mantine/core';
import { useForm } from "@mantine/form";
import { FormEvent, useState, useEffect } from "react";
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { IUser } from '../../context/AuthContext';

type CreateUserFormType = {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  mfa_enabled: boolean,
  picture: File | null
}

const handleSubmit = async (values: CreateUserFormType, event: FormEvent<HTMLFormElement>, endpoint_write : string) => {
  event.preventDefault()


  const JSONdata = JSON.stringify(values)
  const endpoint = 'http://localhost:8080/users/1'

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
  }

  const result = await axios.patch(endpoint, options)
  console.log(`Is this your full name: ${result.data}`)
}

const UserCreateForm = (props:any ) => {

//    const  { user } : IUser = useAuthContext();

    const user = props.values;

    const form = useForm<CreateUserFormType>({
      initialValues: {
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        password: user?.password,
        mfa_enabled: user?.mfa_enabled,
        picture: user?.picture
      },

      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
    });

    console.log("form" , form.values)

  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event, props.ep))}>

        <Group position="center">
          <Avatar
            // Pega arquivo da pasta public/
            src="smile.png"
            size="xl"
          />
        </Group>
        <TextInput
          label="Username"
          {...form.getInputProps('username')}
        />

        <TextInput
          label="FirstName"
          {...form.getInputProps('firstName')}
        />

        <TextInput
          label="LastName"
          {...form.getInputProps('lastName')}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps('password')}
        />

        <Checkbox
          label="Enable 2FA ?"
          {...form.getInputProps('mfa_enabled')}
        />

        <Group position="center" mt="md">
          <Button type="submit">Save Changes</Button>
        </Group>

      </form>
    </Box>
  )

}

const UserForm: FC = () => {

  const id: string = "1";
  const endpoint_read : string = "http://localhost:8080/users/" + id;
  const endpoint_write : string = "http://localhost:8080/users/" + id;

  var [userData, setuserData] = useState<any>(null);

  useEffect(() => {
    async function fetchData(id: string) {
      try {
          const response = await axios.get(endpoint_read)
          setuserData(response.data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData(id);
      console.log("User Data: ", userData)
  },[])

  return (
    <>
      {!userData &&
        <h1> Loading ... </h1>
      }
      {userData &&
        <UserCreateForm values={userData} ep={endpoint_write}/>}
    </>
  );
}

export default UserForm;
