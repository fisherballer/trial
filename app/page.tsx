import {getServerSession} from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import User from './components/user'
//this is server side rendering

export default async function Home() {
    const session = await getServerSession(authOptions)
    return (
        <div>
          <div>Hello</div>
          <pre>{JSON.stringify(session)}</pre>
          <User />
       </div>
    )
  
}
