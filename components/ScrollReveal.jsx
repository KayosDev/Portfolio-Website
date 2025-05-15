import React, { useEffect, useRef, memo } from 'react';
import { useSpring, animated } from '@react-spring/web';

const ScrollReveal = memo(({ 
  children, 
  threshold = 0.1,
  triggerOnce = false,
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right'
  distance = 50,
  duration = 250, // Faster duration
  rootMargin = '0px',
  damping = 0.6,
  tension = 380, // Higher tension for faster animation
  friction = 26, // Higher friction for less oscillation
  className = '',
  style = {},
}) => {
  const ref = useRef(null);
  const [props, api] = useSpring(() => ({
    opacity: 0,
    x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
    scale: 0.96, // Smaller scale change
    config: {
      tension,
      friction,
      duration,
    },
  }));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Track animation state
    let isVisible = false;

    // Throttle function to prevent too many calculations
    const throttle = (func, limit) => {
      let inThrottle;
      return function() {
        if (!inThrottle) {
          func.apply(this, arguments);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };

    const observer = new IntersectionObserver(
      throttle((entries) => {
        entries.forEach((entry) => {
          // When element enters viewport
          if (entry.isIntersecting && !isVisible) {
            api.start({
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              delay,
              config: {
                tension,
                friction,
                duration,
              },
            });
            
            isVisible = true;
            
            // If triggerOnce is true, disconnect observer after animation
            if (triggerOnce) {
              observer.disconnect();
            }
          } 
          // When element exits viewport and we want recurring animations
          else if (!entry.isIntersecting && isVisible && !triggerOnce) {
            api.start({
              opacity: 0,
              x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
              y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
              scale: 0.96,
              delay: 0,
              config: {
                tension,
                friction,
                duration: duration * 0.8, // Faster exit animation
              },
            });
            
            isVisible = false;
          }
        });
      }, 100), // Throttle to run at most once every 100ms
      {
        root: null, 
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [api, delay, direction, distance, friction, tension, triggerOnce, rootMargin, threshold, duration]);

  return (
    <animated.div 
      ref={ref} 
      style={{ 
        ...props, 
        ...style,
        willChange: 'transform, opacity', // Signal browser to optimize for these changes
        WebkitBackfaceVisibility: 'hidden', // Helps performance on some devices
        backfaceVisibility: 'hidden',
      }}
      className={className}
    >
      {children}
    </animated.div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal; 