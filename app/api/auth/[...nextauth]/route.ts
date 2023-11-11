import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github"
import prisma from '@/libs/prismadb'
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import bcrypt from 'bcrypt'

export const authOptions:NextAuthOptions = {
    adapter:PrismaAdapter(prisma),
    providers: [

      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ??'',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET??'',
        }),

        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              username: { label: "Username", type: "text", placeholder: "Gary" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
              if (!credentials.email || !credentials.password) {
                throw new Error('Please enter an email and password')
              }

              const user = await prisma.user.findUnique({
                where:{
                  email: credentials.email
                }
              })

              if (!user || !user?.hashedPassword) {
                throw new Error('No users found')
              }

              const passwordMatch = await bcrypt.compare(
                credentials?.password, user.hashedPassword
              )

              if (!passwordMatch) {
                throw new Error('Incorrect password')
              }

              return user;
            }
          }),       
      ],
      secret:process.env.SECRET,
      session:{strategy:'jwt'},
      debug: process.env.NODE_ENV === 'development'

 }

const handler = NextAuth(authOptions) 
export {handler  as GET , handler  as POST}