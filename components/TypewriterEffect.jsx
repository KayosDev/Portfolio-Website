import React, { useState, useEffect, useRef } from 'react';

const TypewriterEffect = ({
  texts = ['Default Text'],
  startDelay = 700,
  typeSpeed = 120,
  deleteSpeed = 80,
  delayBetweenTexts = 1500,
  loop = true,
  className = '',
  cursorClassName = '',
  showCursor = true,
  textClassName = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isFirstRun, setIsFirstRun] = useState(true);
  
  // Animation frame ref for better performance
  const animationFrameId = useRef(null);
  const timeoutId = useRef(null);
  
  useEffect(() => {
    // Clean up any pending timeouts/animation frames on unmount
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    // For the first run, wait for the startDelay
    if (isFirstRun) {
      timeoutId.current = setTimeout(() => {
        setIsFirstRun(false);
      }, startDelay);
      return;
    }
    
    const currentText = texts[textIndex];
    
    const updateText = () => {
      if (isDeleting) {
        // Delete text one character at a time
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          timeoutId.current = setTimeout(updateText, deleteSpeed);
        } else {
          // Move to the next text after deleting
          setIsDeleting(false);
          
          // If loop is false and we're at the last text, don't advance
          if (!loop && textIndex === texts.length - 1) {
            return;
          }
          
          const nextIndex = (textIndex + 1) % texts.length;
          setTextIndex(nextIndex);
          
          // Add a pause before starting to type the next text
          timeoutId.current = setTimeout(() => {
            // Start typing the next text
            animationFrameId.current = requestAnimationFrame(updateText);
          }, delayBetweenTexts);
        }
      } else {
        // Add text one character at a time
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
          timeoutId.current = setTimeout(updateText, typeSpeed);
        } else {
          // After fully typing, pause before deleting
          timeoutId.current = setTimeout(() => {
            // If loop is false and we're at the last text, don't delete
            if (!loop && textIndex === texts.length - 1) {
              return;
            }
            setIsDeleting(true);
            animationFrameId.current = requestAnimationFrame(updateText);
          }, delayBetweenTexts);
        }
      }
    };

    // Start the typing/deleting loop
    timeoutId.current = setTimeout(updateText, 0);
    
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [displayText, isDeleting, textIndex, texts, typeSpeed, deleteSpeed, delayBetweenTexts, isFirstRun, loop]);

  return (
    <span className={className}>
      <span className={textClassName}>{displayText}</span>
      {showCursor && (
        <span className={`cursor ${cursorClassName}`} style={{
          display: 'inline-block',
          width: '3px',
          height: '1.2em',
          backgroundColor: 'currentColor',
          marginLeft: '2px',
          animation: 'blink 1s step-end infinite',
          verticalAlign: 'text-bottom',
        }}>
        </span>
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default TypewriterEffect; 