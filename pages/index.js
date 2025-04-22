import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Starfield from '../components/Starfield'

const variants = {
  hidden: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
}

export default function Home() {
  return (
    <>
      <Head>
        <title>KayosDev Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Starfield />
      <motion.div
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        className="container"
      >
        <motion.header
          className="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.8 } }}
        >
          <h1>
            Welcome, I'm <span className="highlight">KayosDev</span>
          </h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 100 } }}
          >
            Gameplay and Engine Developer
          </motion.p>
        </motion.header>

        <motion.section
          id="about"
          className="about section"
          initial="hidden"
          whileInView="enter"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
        >
          <h2>About Me</h2>
          <p>
            I'm a co-founder of Endless Nights studios and i'm a passionate Gameplay and Engine Developer.
          </p>
        </motion.section>

        <motion.section
          id="projects"
          className="projects section"
          initial="hidden"
          whileInView="enter"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
        >
          <h2>Projects</h2>
          <div className="project-grid">
            <Link href="/projects/one">
              <motion.div
                className="card"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <h3>Project One</h3>
                <p>A modern web app with animations.</p>
              </motion.div>
            </Link>
            <Link href="/projects/two">
              <motion.div
                className="card"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <h3>Project Two</h3>
                <p>A sleek portfolio design.</p>
              </motion.div>
            </Link>
            <Link href="/projects/three">
              <motion.div
                className="card"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <h3>Project Three</h3>
                <p>Another project showcase.</p>
              </motion.div>
            </Link>
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="contact section"
          initial="hidden"
          whileInView="enter"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
        >
          <h2>Contact Me</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows={5} required />
            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </motion.section>
      </motion.div>
    </>
  )
}
