import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

const AnimatedToast = animated(Toast);

const ScrollToast = ({ 
  sections = [
    { id: 'home', name: 'Home', message: 'Welcome to my portfolio!' },
    { id: 'about', name: 'About', message: 'Learn about my background and skills.' },
    { id: 'projects', name: 'Projects', message: 'Check out my latest work.' }
  ],
  position = 'bottom-start', // 'top-start', 'top-end', 'bottom-start', 'bottom-end'
  autohideDuration = 4000
}) => {
  const [currentSection, setCurrentSection] = useState(null);
  const [show, setShow] = useState(false);
  const [toastTimeoutId, setToastTimeoutId] = useState(null);
  
  const positionStyles = {
    'top-start': { top: 20, left: 20 },
    'top-end': { top: 20, right: 20 },
    'bottom-start': { bottom: 20, left: 20 },
    'bottom-end': { bottom: 20, right: 20 }
  };
  
  // Toast animation
  const toastAnimation = useSpring({
    opacity: show ? 1 : 0,
    transform: show 
      ? 'translateY(0) scale(1)' 
      : position.includes('top') 
        ? 'translateY(-20px) scale(0.95)' 
        : 'translateY(20px) scale(0.95)',
    config: { tension: 280, friction: 20 }
  });

  // Monitor scroll position to detect current section
  useEffect(() => {
    const handleScroll = () => {
      // Check which section is currently in viewport
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          // We're in this section
          if (currentSection?.id !== section.id) {
            // New section detected
            setCurrentSection(section);
            setShow(true);
            
            // Clear any existing timeout
            if (toastTimeoutId) {
              clearTimeout(toastTimeoutId);
            }
            
            // Set timeout to hide toast
            const timeoutId = setTimeout(() => {
              setShow(false);
            }, autohideDuration);
            
            setToastTimeoutId(timeoutId);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
      }
    };
  }, [sections, currentSection, autohideDuration, toastTimeoutId]);

  return (
    <AnimatedToast 
      style={{
        ...toastAnimation,
        position: 'fixed',
        zIndex: 1030,
        ...positionStyles[position],
        background: 'rgba(30,34,44,0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        padding: '10px 15px',
        minWidth: '280px',
        borderRadius: '12px'
      }}
      show={show}
      onClose={() => setShow(false)}
    >
      <Toast.Header 
        closeButton={true}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white'
        }}
      >
        <strong className="me-auto" style={{ color: 'var(--primary-color)' }}>
          {currentSection?.name || 'Section'} 
        </strong>
      </Toast.Header>
      <Toast.Body style={{ color: 'white' }}>
        {currentSection?.message || 'Scrolling through the site'}
        
        {/* Progress bar for auto-hide */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            height: '3px', 
            background: 'var(--primary-color)',
            borderRadius: '0 0 12px 12px',
            width: '100%',
            animation: `progress ${autohideDuration}ms linear forwards`
          }} 
        />
      </Toast.Body>
      
      <style jsx global>{`
        @keyframes progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </AnimatedToast>
  );
};

export default ScrollToast; 