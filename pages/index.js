import React from 'react'
import Head from 'next/head'
import { useSpring, animated } from '@react-spring/web'
import Link from 'next/link'
import Starfield from '../components/Starfield'

export default function Home() {
  return (
    <>
      <Head>
        <title>KayosDev Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Starfield />
      <animated.div style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, config: { tension: 180, friction: 24 } })} className="container">
        <animated.header className="hero" style={useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, delay: 200, config: { tension: 180, friction: 24 } })}>
          <h1>
            Welcome, I'm <span className="highlight">KayosDev</span>
          </h1>
          <animated.p
            className="hero-subtitle"
            style={useSpring({ from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, delay: 400, config: { tension: 180, friction: 24 } })}
          >
            Gameplay and Engine Developer
          </animated.p>
        </animated.header>

        <animated.section style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, delay: 600, config: { tension: 180, friction: 24 } })} id="about" className="about section">
          <h2>About Me</h2>
          <p>
            I'm a co-founder of Endless Nights studios and i'm a passionate Gameplay and Engine Developer.
          </p>
        </animated.section>

        <animated.section style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, delay: 800, config: { tension: 180, friction: 24 } })} id="projects" className="projects section">
          <h2>Projects</h2>
          <div className="project-grid">
            <Link href="/projects/one">
              <animated.div
                className="card"
                style={useSpring({ from: { scale: 1 }, to: { scale: 1 }, config: { tension: 180, friction: 24 } })}
              >
                <h3>Project One</h3>
                <p>A modern web app with animations.</p>
              </animated.div>
            </Link>
            <Link href="/projects/two">
              <animated.div
                className="card"
                style={useSpring({ from: { scale: 1 }, to: { scale: 1 }, config: { tension: 180, friction: 24 } })}
              >
                <h3>Project Two</h3>
                <p>A sleek portfolio design.</p>
              </animated.div>
            </Link>
            <Link href="/projects/three">
              <animated.div
                className="card"
                style={useSpring({ from: { scale: 1 }, to: { scale: 1 }, config: { tension: 180, friction: 24 } })}
              >
                <h3>Project Three</h3>
                <p>Another project showcase.</p>
              </animated.div>
            </Link>
          </div>
        </animated.section>

        <animated.section style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, delay: 1000, config: { tension: 180, friction: 24 } })} id="contact" className="contact section">
          <h2>Contact Me</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows={5} required />
            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </animated.section>
      </animated.div>
    </>
  )
}
