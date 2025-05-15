import React, { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import { useSpring, animated, easings, config } from '@react-spring/web'
import Link from 'next/link'
import Starfield from '../components/Starfield'
import SocialFooter from '../components/SocialFooter'
import PixelText from '../components/PixelText'
import ScrollReveal from '../components/ScrollReveal'
import ProjectCard3D from '../components/ProjectCard3D'

export default function Home() {
  const [uiVisible, setUiVisible] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const heroRef = useRef(null);

  // Visually stunning fade/blur/scale animation for UI
  const uiSpring = useSpring({
    opacity: uiVisible ? 1 : 0,
    y: uiVisible ? 0 : 120,
    scale: uiVisible ? 1 : 1.05,
    filter: uiVisible ? 'blur(0px)' : 'blur(16px)',
    pointerEvents: uiVisible ? 'auto' : 'none',
    config: { duration: uiVisible ? 400 : 300, easing: easings.easeInOutCubic },
  });

  // Hint fade/slide animation
  const hintSpring = useSpring({
    opacity: showHint ? 0.93 : 0,
    y: showHint ? 0 : 40,
    config: { duration: 400, easing: easings.easeInOutCubic },
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

  // Add tilt effect to hero section
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 50;
      const tiltY = (centerX - x) / 50;
      
      hero.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    
    const handleMouseLeave = () => {
      hero.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };
    
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
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
        <div className="hero-container" id="home">
          <div className="hero-glow"></div>
          <animated.header className="hero" style={useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, delay: 100, config: { tension: 280, friction: 20 } })}>
            <div className="hero-content" ref={heroRef}>
              <div className="hero-title-wrapper">
                <animated.h1
                  style={useSpring({
                    from: { opacity: 0, y: 30 },
                    to: { opacity: 1, y: 0 },
                    delay: 150,
                    config: { tension: 280, friction: 18 }
                  })}
                >
                  <span className="hero-title-main" data-text="Welcome, I'm">Welcome, I'm</span>
                  <animated.span 
                    className="highlight"
                    style={useSpring({
                      from: { scale: 0.8, opacity: 0 },
                      to: { scale: 1, opacity: 1 },
                      delay: 400,
                      config: { mass: 1.5, tension: 280, friction: 15 }
                    })}
                  >
                    KayosDev
                  </animated.span>
                </animated.h1>
              </div>
              <PixelText 
                text="GAMEPLAY & ENGINE<br/>DEVELOPER" 
                delay={600} 
                className="hero-subtitle"
              />
            </div>
          </animated.header>
        </div>

        <ScrollReveal 
          threshold={0.15} 
          triggerOnce={true} 
          delay={200} 
          direction="up" 
          distance={80}
          duration={700}
          tension={320}
          friction={20}
          className="about section"
          id="about"
        >
          <h2>About Me</h2>
          <div className="about-hero">
            "I create immersive gameplay experiences and optimize game engines for performance, bringing interactive worlds to life with code."
          </div>
        </ScrollReveal>

        <ScrollReveal 
          threshold={0.15} 
          triggerOnce={true} 
          delay={200} 
          direction="up" 
          distance={80}
          duration={700}
          tension={320}
          friction={20}
          className="projects section"
          id="projects"
        >
          <h2>My Work</h2>
          <div className="project-grid">
              <ProjectCard3D
                title="Web App: Nebula"
                description="A modern web app with stunning animations and interactive features. Built with React and Three.js."
                link="/projects/one"
                glowColor="rgba(255, 107, 107, 0.6)"
                maxTilt={20}
              />
              <ProjectCard3D
                title="Portfolio Redesign"
                description="A sleek portfolio design with immersive 3D effects and responsive layout for optimal viewing on any device."
                link="/projects/two"
                glowColor="rgba(128, 255, 234, 0.6)"
                maxTilt={20}
              />
              <ProjectCard3D
                title="Visual Playground"
                description="Experimental visual effects showcase combining WebGL, particle systems and advanced animation techniques."
                link="/projects/three"
                glowColor="rgba(255, 255, 128, 0.6)"
                maxTilt={20}
              />
          </div>
        </ScrollReveal>

        <ScrollReveal 
          threshold={0.1} 
          triggerOnce={false} 
          delay={300} 
          direction="up" 
          distance={60}
        >
          <SocialFooter />
        </ScrollReveal>
      </animated.div>
    </>
  )
}
