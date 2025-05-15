import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Link from 'next/link';

// Simple debounce function to limit frequent updates
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const ProjectCard3D = memo(({ 
  title, 
  description, 
  link, 
  onClick,
  glowColor = "rgba(255, 107, 107, 0.6)", 
  maxTilt = 20,
  maxScale = 1.08,
  perspective = 1200,
  transitionSpeed = 300,
  className = '',
  children
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [distFromCenter, setDistFromCenter] = useState({ x: 0, y: 0 });

  // Enhanced spring properties with better interpolation
  const springProps = useSpring({
    rotateX: isHovered ? -distFromCenter.y * maxTilt : 0,
    rotateY: isHovered ? distFromCenter.x * maxTilt : 0, 
    scale: isHovered ? maxScale : 1,
    shadow: isHovered ? 1 : 0,
    border: isHovered ? 1 : 0,
    z: isHovered ? 50 : 0, // Add Z translation for better 3D effect
    config: { mass: 1, tension: 320, friction: 25, duration: transitionSpeed }
  });

  // Light effect with enhanced properties
  const lightProps = useSpring({
    opacity: isHovered ? 0.8 : 0,
    scale: isHovered ? 1.1 : 0.8,
    config: { duration: transitionSpeed * 1.2 }
  });

  // Enhanced content spring animation
  const contentProps = useSpring({
    y: isHovered ? -5 : 0,
    opacity: isHovered ? 1 : 0.95,
    scale: isHovered ? 1.03 : 1,
    config: { mass: 0.6, tension: 400, friction: 26 }
  });

  // Debounced mouse move handler to improve performance
  const handleMouseMove = useCallback(
    debounce((e) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      
      // Calculate normalized position (0 to 1) within card
      const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
      setCoords({ x, y });
      
      // Calculate distance from center (-1 to 1)
      const distX = (x - 0.5) * 2;
      const distY = (y - 0.5) * 2;
      setDistFromCenter({ x: distX, y: distY });
    }, 5), // Make it more responsive
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setDistFromCenter({ x: 0, y: 0 });
  }, []);

  // Add/remove event listeners for performance
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    if (isHovered) {
      card.addEventListener('mousemove', handleMouseMove);
    } else {
      card.removeEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isHovered, handleMouseMove]);

  const CardContent = memo(() => (
    <animated.div
      ref={cardRef}
      className={`card ${className}`}
      style={{
        // Apply transforms individually for better interpolation with Z transform
        transform: springProps.scale.to(
          (s) => `perspective(${perspective}px) 
            rotateX(${springProps.rotateX.to((r) => r.toFixed(2))}deg) 
            rotateY(${springProps.rotateY.to((r) => r.toFixed(2))}deg)
            translateZ(${springProps.z.to((z) => z.toFixed(0))}px) 
            scale3d(${s}, ${s}, ${s})`
        ),
        boxShadow: springProps.shadow.to(
          (s) => s === 0 
            ? '0 8px 32px 0 rgba(30,34,44,0.18), 0 1.5px 8px 0 rgba(255,107,168,0.08)'
            : `0 20px 50px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 30px ${glowColor}`
        ),
        borderColor: springProps.border.to(
          (b) => b === 0 ? 'rgba(255,255,255,0.13)' : 'var(--primary-color)'
        ),
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform, box-shadow',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Enhanced light effect overlay with dynamic opacity and scale */}
      <animated.div 
        className="light-effect" 
        style={{
          opacity: lightProps.opacity,
          transform: lightProps.scale.to(s => `scale(${s})`),
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
          backgroundPosition: `${coords.x * 100}% ${coords.y * 100}%`,
          backgroundImage: `radial-gradient(circle at center, ${glowColor.replace(')', ', 0.2)')}, ${glowColor.replace(')', ', 0.05)')} 40%, transparent 70%)`,
          backgroundSize: '200% 200%',
          filter: 'blur(10px)',
          willChange: 'opacity, transform, background-position'
        }}
      />
      
      {/* Enhanced content animation */}
      <animated.div 
        className="card-content" 
        style={{ 
          position: 'relative', 
          zIndex: 2,
          transform: contentProps.y.to(y => `translateY(${y}px) scale(${contentProps.scale.get()})`),
          opacity: contentProps.opacity,
          willChange: 'transform, opacity'
        }}
      >
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
        {children}
      </animated.div>
    </animated.div>
  ));
  
  CardContent.displayName = 'CardContent';

  return link ? (
    <Link href={link}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
});

ProjectCard3D.displayName = 'ProjectCard3D';

export default ProjectCard3D; 