import React from 'react'
import Head from 'next/head'
import { useSpring, animated } from '@react-spring/web'
import Link from 'next/link'

export default function ProjectTwo() {
  return (
    <>
      <Head>
        <title>Project Two - KayosDev</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <animated.div style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, config: { tension: 180, friction: 24 } })} className="container section">
        <h1>Project Two</h1>
        <p>This is a placeholder page for Project Two.</p>
        <Link href="/">← Back to Home</Link>
      </animated.div>
    </>
  )
}
