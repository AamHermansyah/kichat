'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/db';

import { getUserByEmail } from '@/data/user'
import { Register } from '@/types';
// import { generateVerificationToken } from '@/lib/tokens'
// import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: Register) => {
  if (!values.email || !values.name || !values.password) {
    return { error: 'Input tidak valid!' }
  }

  const { name, password, email } = values;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email telah digunakan. Coba lagi!' }
  }

  await prisma.user.create({
    data: {
      hashedPassword,
      email,
      name,
      // Sementara
      emailVerified: new Date()
    }
  });

  // const verificationToken = await generateVerificationToken(email);

  // await sendVerificationEmail(
  //   verificationToken.email,
  //   verificationToken.token,
  //   name
  // );

  // return { success: 'Konfirmasi email telah dikirim!' }

  return { success: 'Berhasil membuat akun. Silahkan login!' }
}