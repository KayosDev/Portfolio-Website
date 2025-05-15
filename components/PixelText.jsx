import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

const PixelText = ({ text, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const animationCompleted = useRef(false);
  
  // Split text on <br/> tags
  const lines = text.split('<br/>');
  
  // Animation for the container - faster and more springy
  const containerSpring = useSpring({
    from: { opacity: 0, y: 20, scale: 0.9 },
    to: { opacity: 1, y: 0, scale: 1 },
    delay,
    config: { tension: 280, friction: 12 } // More tension, less friction for faster, bouncier animation
  });
  
  // Animation after typing is complete - more pronounced effect
  const completeSpring = useSpring({
    transform: isComplete ? 'scale(1.05)' : 'scale(1)',
    config: { tension: 400, friction: 8 } // Even more pronounced spring effect
  });

  useEffect(() => {
    // Prevent animation from running again if it's already completed
    if (animationCompleted.current) return;
    
    // Start typing after the initial delay
    const initialTimeout = setTimeout(() => {
      let currentLineText = '';
      let lineIndex = 0;
      let correctText = '';
      let hasTypo = false;
      let fixingTypo = false;
      
      // Create a typo by replacing a character with a random similar one
      const createTypo = (text) => {
        if (text.length === 0) return text;
        
        // Common typo pairs (keys close to each other on keyboard)
        const typoPairs = {
          'A': 'S', 'S': 'A', 'D': 'F', 'F': 'D', 'E': 'R', 'R': 'E',
          'G': 'H', 'H': 'G', 'I': 'O', 'O': 'I', 'P': 'L', 'L': 'P',
          'V': 'B', 'B': 'V', 'N': 'M', 'M': 'N', 'Y': 'T', 'T': 'Y'
        };
        
        const lastChar = text.charAt(text.length - 1);
        if (typoPairs[lastChar]) {
          return text.substring(0, text.length - 1) + typoPairs[lastChar];
        }
        return text;
      };
      
      // Type out each character with a pixel-like loading effect - faster now
      const typeNextChar = () => {
        // Normal typing phase
        if (lineIndex < lines.length) {
          const targetLine = lines[lineIndex];
          correctText = targetLine.substring(0, currentLineText.length + 1);
          
          if (currentLineText.length < targetLine.length) {
            // Check if we should introduce a typo (8% chance if not already fixing a typo)
            if (!fixingTypo && !hasTypo && Math.random() < 0.08) {
              currentLineText = createTypo(correctText);
              hasTypo = true;
              
              setDisplayedText(prevText => {
                const prevLines = prevText.split('\n');
                prevLines[lineIndex] = currentLineText;
                return prevLines.join('\n');
              });
              
              // Schedule fixing the typo - faster now
              setTimeout(() => {
                fixingTypo = true;
                currentLineText = correctText;
                
                setDisplayedText(prevText => {
                  const prevLines = prevText.split('\n');
                  prevLines[lineIndex] = currentLineText;
                  return prevLines.join('\n');
                });
                
                // After fixing, continue with a slight pause - faster now
                setTimeout(() => {
                  fixingTypo = false;
                  hasTypo = false;
                  typeNextChar();
                }, 60); // Reduced from 100
              }, 200); // Reduced from 300
              
              return;
            }
            
            // If we're not handling a typo, proceed normally
            if (!hasTypo && !fixingTypo) {
              currentLineText = correctText;
              setDisplayedText(prevText => {
                const prevLines = prevText.split('\n');
                prevLines[lineIndex] = currentLineText;
                return prevLines.join('\n');
              });
              
              // Type next character with a short, random delay - faster now
              setTimeout(typeNextChar, 25 + Math.random() * 20); // Reduced from 50+40
            }
          } else {
            // Line completed
            if (lineIndex < lines.length - 1) {
              // If there are more lines, move to the next one
              lineIndex++;
              currentLineText = '';
              setCurrentLine(lineIndex);
              setTimeout(typeNextChar, 120); // Reduced from 200
            } else {
              // All text is typed out, we're done
              setIsComplete(true);
              animationCompleted.current = true; // Mark animation as completed to prevent restarting
              
              // Add a quick pop effect when complete
              const pop = () => {
                setIsComplete(false);
                setTimeout(() => setIsComplete(true), 150);
              };
              
              setTimeout(pop, 300);
            }
          }
        }
      };
      
      typeNextChar();
    }, Math.max(0, delay - 100)); // Reduce delay to start animation earlier
    
    return () => clearTimeout(initialTimeout);
  }, [lines, delay]);

  return (
    <animated.p className={className} style={{...containerSpring, ...completeSpring}}>
      {displayedText.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < displayedText.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
      {!isComplete && <span className="pixel-cursor"></span>}
    </animated.p>
  );
};

export default PixelText; 