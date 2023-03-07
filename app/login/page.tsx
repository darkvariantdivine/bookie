"use client";

import {
  isEmail,
  useForm
} from "@mantine/form";
import {
  Button,
  Container,
  createStyles,
  Modal,
  PasswordInput,
  TextInput,
  Space,
  Paper
} from "@mantine/core";
import {
  IconKey,
  IconLogin,
  IconUserCircle,
  IconX
} from "@tabler/icons";
import {MantineTheme} from "@mantine/styles/lib/theme";
import React, {
  FormEvent,
  useContext,
  useState
} from "react";
import {showNotification} from "@mantine/notifications";
import {
  AxiosError,
  AxiosResponse
} from "axios";
import {
  QueryClient,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

import {
  IUser,
  IUserAuth
} from "@/constants";
import handleApiError from "@/hooks/errors";
import {API} from "@/libs/rest";
import {UserContext} from "@/contexts/UserContext";
// import {PhotoCarouselWithAutoplay} from "@/components/PhotoCarousel";

const useStyles = createStyles((theme: MantineTheme) => ({
  signIn: {
    fontWeight: 500,
    color: theme.white,
    backgroundColor: 'transparent',
    borderColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      ),
    },
  },

  submit: {
    marginRight: 0,
    fontWeight: 500,
    color: theme.white,
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
      0.1
    ),
    borderColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.2
      ),
    },
  },
}));

const SignInMenu = (): React.ReactElement => {
  const form = useForm<IUserAuth>({
    initialValues: {
      username: '',
      password: ''
    },
    validate: {
      username: isEmail('Invalid email address'),
    },
  });

  const router = useRouter();
  const { classes, theme, cx } = useStyles();
  const {setUser, setToken} = useContext(UserContext);

  const [opened, setOpened] = useState(true);

  const queryClient: QueryClient = useQueryClient();
  const { mutate: handleLogin } = useMutation({
    mutationFn: (auth: IUserAuth) => API.post(
      `/login`, auth
    ).then(
      (response: AxiosResponse) => {
        let token: string = (
          response.headers?.authorization as string
        ).split(' ')[1];
        return {
          user: response.data,
          token
        }
      }
    ),
    onSuccess: (data: {user: IUser, token: string}, variables: IUserAuth) => {
      console.log(`Successfully logged in user ${variables.username}, with details ${data.user}`);
      sessionStorage.setItem('USER', JSON.stringify(data.user));
      sessionStorage.setItem('TOKEN', data['token'] as string);
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['token'], data.token);
      setUser(data.user);
      setToken(data.token);
      showNotification({
        icon: <IconLogin color={'teal'} />,
        message: `${data.user.name} successfully logged in`,
        color: 'teal'
      })
      form.reset();
      setOpened(false);
      router.push('/rooms');
      return data;
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
      form.reset();
    }
  });

  const handleErrors = (errors: typeof form.errors, values: typeof form.values) => {
    console.log(`Errors ${JSON.stringify(errors)} occurred when 
                 submitting form with values ${JSON.stringify(values)}`)
    if (errors.username) {
      showNotification({
        icon: <IconX />,
        message: errors.username,
        color: 'red'
      });
    }
    form.reset();
  };

  const handleSubmit = (values: typeof form.values, event: FormEvent) => {
    console.log(`Signing in user ${values.username}`)
    handleLogin(values);
    event.preventDefault();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      transition={"fade"}
      size={"lg"}
      overlayOpacity={0.55}
      overlayBlur={3}
      transitionDuration={200}
      radius={'sm'}
      centered
      title={'Sign in to Bookie'}
    >
      <Paper>
        <Container>
          <form
            onSubmit={form.onSubmit(handleSubmit, handleErrors)}
          >
            <TextInput
              icon={<IconUserCircle />}
              label={'Username'}
              description={"Please enter your login email address"}
              variant={"filled"}
              placeholder={"Your email"}
              withAsterisk
              {...form.getInputProps('username')}
            />
            <Space h={'md'}/>
            <PasswordInput
              icon={<IconKey />}
              label={'Password'}
              description={"Please enter your password"}
              variant={"filled"}
              placeholder={"Password"}
              withAsterisk
              {...form.getInputProps('password')}
            />
            <Space h={'md'}></Space>
            <Button
              className={classes.submit}
              type={'submit'}
            >
              Log In
            </Button>
          </form>
        </Container>
        {/*<PhotoCarouselWithAutoplay*/}
        {/*  imagesToDisplay={["/MeetingRoom1.jpg", "/MeetingRoom2.jpg", "/MeetingRoom3.jpg"]}*/}
        {/*/>*/}
      </Paper>
    </Modal>
  )
}

export default SignInMenu;