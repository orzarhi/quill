'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

export default function page() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const origin = searchParams.get('origin')

    const URL = process.env.DEV_URL

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                router.push(origin ? `http://localhost:3000/${origin}` : `http://localhost:3000/dashboard`)
            }
        },
        onError: (err) => {
            if (err.data?.code === 'UNAUTHORIZED') {
                router.push('/sign-in')
            }
        },
        retry: true,
        retryDelay: 500,
    })

    return (
        <div className='flex justify-center w-full mt-40'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className='font-semibold text-xl'>Setting up your account...</h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    )
}
