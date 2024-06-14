'use server'

import { AuthError } from 'next-auth'

import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByEmail } from '@/data/user'
import { Login } from '@/types'

export const login = async (values: Login) => {

  if (!values.email || !values.password) {
    return { error: 'Input tidak valid!' }
  }

  const { email, password } = values;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: "Email atau password tidak valid!" }
  }

  if (!existingUser.emailVerified) {
    // const verificationToken = await generateVerificationToken(existingUser.email);

    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token,
    //   existingUser.name
    // );

    // return { success: "Konfirmasi email telah dikirim!" };

    return { error: "Anda belum verifikasi!" };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    });

    return { success: 'Login successfully!' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Kredensial tidak valid!' }
        default:
          return { error: 'Internal error!' }
      }
    }

    throw error
  }
}