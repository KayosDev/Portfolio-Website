import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useSpring, animated, easings } from '@react-spring/web'
import Link from 'next/link'
import Starfield from '../components/Starfield'

export default function Home() {
  const [uiVisible, setUiVisible] = useState(true);
  const [showHint, setShowHint] = useState(false);

  // Visually stunning fade/blur/scale animation for UI
  const uiSpring = useSpring({
    opacity: uiVisible ? 1 : 0,
    y: uiVisible ? 0 : 120,
    scale: uiVisible ? 1 : 1.05,
    filter: uiVisible ? 'blur(0px)' : 'blur(16px)',
    pointerEvents: uiVisible ? 'auto' : 'none',
    config: { duration: uiVisible ? 700 : 400, easing: easings.easeInOutCubic },
  });

  // Hint fade/slide animation
  const hintSpring = useSpring({
    opacity: showHint ? 0.93 : 0,
    y: showHint ? 0 : 40,
    config: { duration: 600, easing: easings.easeInOutCubic },
  });

  // Fullscreen handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setUiVisible(false);
      setShowHint(false);
    } else {
      document.exitFullscreen();
      setUiVisible(true);
      setTimeout(() => setShowHint(true), 1000); // Optionally show hint again after exiting
    }
  }, []);

  // Listen for "F" key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  // Restore UI if user exits fullscreen via ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setUiVisible(true);
        setTimeout(() => setShowHint(true), 1000);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Show hint after user scrolls past threshold
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !showHint) {
        setShowHint(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showHint]);

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    if (!showHint) return;
    const timeout = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timeout);
  }, [showHint]);

  return (
    <>
      <Head>
        <title>KayosDev Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Starfield />
      {/* Stunning, reserved hint */}
      <animated.div
        style={{
          ...hintSpring,
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: hintSpring.y.to((y) => `translate(-50%, ${y}px)`),
          zIndex: 1000,
          pointerEvents: 'none',
          userSelect: 'none',
          background: 'rgba(30,34,44,0.55)',
          borderRadius: '18px',
          padding: '14px 32px',
          color: 'rgba(255,255,255,0.92)',
          fontWeight: 500,
          fontSize: '1.08rem',
          letterSpacing: '0.02em',
          boxShadow: '0 4px 32px 0 rgba(20,20,40,0.12)',
          backdropFilter: 'blur(12px) saturate(1.2)',
          border: '1.5px solid rgba(255,255,255,0.13)',
          transition: 'opacity 0.4s cubic-bezier(.6,.2,.1,1)',
        }}
        aria-hidden={!showHint}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ filter: 'drop-shadow(0 0 2px #fff6)' }}><circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M6 10h8M10 6v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Press <span style={{fontWeight:700, background:'rgba(255,255,255,0.13)',borderRadius:6,padding:'0 7px',margin:'0 2px',boxShadow:'0 1px 2px #0002',fontFamily:'monospace'}}>F</span> for Focus Mode
        </span>
      </animated.div>
      <animated.div style={uiSpring} className="container">
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
          <blockquote className="about-hero">
            I'm a co-founder of Endless Nights studios and I'm a passionate Gameplay and Engine Developer.
          </blockquote>
        </animated.section>

        <animated.section style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, delay: 800, config: { tension: 180, friction: 24 } })} id="projects" className="projects section">
          <h2>My Work</h2>
          <div className="project-grid">
            <Link href="/projects/one">
              <animated.div
                className="card"
                style={useSpring({ from: { scale: 1 }, to: { scale: 1 }, config: { tension: 180, friction: 24 } })}
              >
                <h3>Web App: Nebula</h3>
                <p>A modern web app with animations.</p>
              </animated.div>
            </Link>
            <Link href="/projects/two">
              <animated.div
                className="card"
                style={useSpring({ from: { scale: 1 }, to: { scale: 1 }, config: { tension: 180, friction: 24 } })}
              >
                <h3>Portfolio Redesign</h3>
                <p>A sleek portfolio design.</p>
              </animated.div>
            </Link>
            <Link href="/projects/three">
              <animated.div
                className="card"
                style={useSpring({ from: { scale: 1 }, to: { scale: 1 }, config: { tension: 180, friction: 24 } })}
              >
                <h3>Visual Playground</h3>
                <p>Another project showcase.</p>
              </animated.div>
            </Link>
          </div>
        </animated.section>

        <animated.section style={useSpring({ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, delay: 1000, config: { tension: 180, friction: 24 } })} id="contact" className="contact section">
          <h2>Get in Touch</h2>
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
