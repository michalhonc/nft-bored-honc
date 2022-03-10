import React from 'react'
import type { NextPage } from 'next'

import { SEO } from '~/components/seo'
import { Logo } from '~/components/logo'
import { Mint } from '~/components/mint'

import { Page } from './style'

export const Home: NextPage = () => {
  const isWallet = typeof window !== 'undefined' && !!window.ethereum

  return (
    <Page>
      <SEO
        title="STRV Next.js app"
        description="change me before going to production"
      />
      <Logo />
      {isWallet ? <Mint /> : <span>No ether wallet :(</span>}
    </Page>
  )
}
