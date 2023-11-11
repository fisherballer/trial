'use client' //as useContext is a hook you need to declare client

import {useSession, signOut} from 'next-auth/react'

export default function User(){
    const {data:session} = useSession()
    return (
        <div>
            {JSON.stringify(session)}
        </div>
    )
}