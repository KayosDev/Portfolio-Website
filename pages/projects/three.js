import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
}

export default function ProjectThree() {
  return (
    <>
      <Head>
        <title>Project Three - KayosDev</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <motion.div
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        className="container section"
      >
        <h1>Project Three</h1>
        <p>This is a placeholder page for Project Three.</p>
        <Link href="/">← Back to Home</Link>
      </motion.div>
    </>
  )
}
