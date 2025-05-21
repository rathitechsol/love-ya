import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import confetti from 'canvas-confetti';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pacifico', cursive;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const hearts = keyframes`
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-100vh); opacity: 0; }
`;

const AppContainer = styled.div`
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  overflow: hidden;
`;

const Container = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  transform: scale(0.95);
  transition: all 0.3s ease;
  z-index: 1;
`;

const Title = styled.h1`
  color: #ff6b6b;
  font-size: 2.5em;
  margin-bottom: 1.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const ButtonGroup = styled.div`
  position: relative;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: ${props => props.primary ? '#ff6b6b' : '#4ecdc4'};
  color: white;
  min-width: 120px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: ${props => props.primary ? 'translateY(-3px)' : 'none'};
    box-shadow: ${props => props.primary ? '0 5px 15px rgba(255,107,107,0.4)' : '0 5px 15px rgba(78,205,196,0.4)'};
  }
`;

const Result = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 2em;
  font-size: 1.5em;
  color: #ff6b6b;
  animation: ${float} 3s ease-in-out infinite;
`;

const Heart = styled.div`
  position: absolute;
  animation: ${hearts} 3s linear infinite;
  opacity: 0;
  left: ${props => props.left}vw;
  animation-delay: ${props => props.delay}s;
  font-size: 24px;
  z-index: 0;
`;

const Particles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

function App() {
  const [showResult, setShowResult] = useState(false);
  const [hearts, setHearts] = useState([]);
  const noBtnRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastDodgeTime, setLastDodgeTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if mouse is near the NO button
      if (noBtnRef.current) {
        const button = noBtnRef.current;
        const buttonRect = button.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        // Calculate distance from mouse to button center
        const dx = buttonCenterX - e.clientX;
        const dy = buttonCenterY - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If mouse is within 100px of the button, trigger dodge
        if (distance < 100) {
          const now = Date.now();
          // Only dodge if enough time has passed since last dodge (100ms)
          if (now - lastDodgeTime > 100) {
            setLastDodgeTime(now);
            dodge(e.clientX, e.clientY);
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastDodgeTime]);

  const dodge = (mouseX, mouseY) => {
    if (noBtnRef.current) {
      const button = noBtnRef.current;
      const buttonRect = button.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      // Calculate direction away from mouse
      const dx = buttonCenterX - mouseX;
      const dy = buttonCenterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normalize direction
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Calculate new position (move away from mouse)
      const moveDistance = 150; // Increased distance
      const newX = buttonCenterX + dirX * moveDistance;
      const newY = buttonCenterY + dirY * moveDistance;

      // Keep button within viewport
      const maxX = window.innerWidth - buttonRect.width;
      const maxY = window.innerHeight - buttonRect.height;
      const boundedX = Math.min(Math.max(0, newX - buttonRect.width / 2), maxX);
      const boundedY = Math.min(Math.max(0, newY - buttonRect.height / 2), maxY);

      // Apply faster transition
      button.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      button.style.transform = `translate(${boundedX - buttonRect.left}px, ${boundedY - buttonRect.top}px)`;
    }
  };

  const showLove = () => {
    setShowResult(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#ff8e8e', '#4ecdc4']
    });
    
    // Add floating hearts
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setHearts(newHearts);
  };

  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Particles id="particles" />
        <Container>
          <Title>💖 My Forever Valentine 💖</Title>
          <ButtonGroup>
            <Button primary onClick={showLove}>YES</Button>
            <Button 
              ref={noBtnRef} 
              onMouseOver={(e) => dodge(e.clientX, e.clientY)}
            >
              NO
            </Button>
          </ButtonGroup>
          <Result show={showResult}>You know I love you too! 💕</Result>
        </Container>
        {hearts.map(heart => (
          <Heart key={heart.id} left={heart.left} delay={heart.delay}>
            💖
          </Heart>
        ))}
      </AppContainer>
    </>
  );
}

export default App; 