import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { Lightning } from './components/Lightning';
import { Background } from './components/Background';
import { RainDrop } from './components/RainDrop';
import { Sound } from './components/Sound';
import styled from 'styled-components';
import { Sun } from './components/Sun';

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 1%;
  right: 1%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const StyledButton = styled.button`
  background: linear-gradient(to right, #000000, #000000, #8A2BE2);
  border: 1px solid black;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  font-size: 12px;
  color: white;
  cursor: pointer;
  margin: 5px 0;
`;

function App() {
  const appRef = useRef<PIXI.Application | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isThunderEnabled, setIsThunderEnabled] = useState(true);
  const [isSunEnabled, setIsSunEnabled] = useState(true);
  const [isNight, setIsNight] = useState(true);
  const [components, setComponents] = useState<{
    rainDrop?: RainDrop;
    rainSound?: Sound;
    thunderSound?: Sound;
    lightning?: Lightning;
    background?: Background;
    backgroundDay?: Background;
    sun?: Sun;
  }>({});

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize PIXI Application
      const app = new PIXI.Application();
      await app.init({
        resizeTo: window,
        backgroundColor: 0x000000,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      appRef.current = app;

      // Load textures
      await PIXI.Assets.load([
        'images/raindrop.png',
        'images/heart.png',
        'images/background.png',
        'images/house.png',
        'images/dayhouse.png',
        'images/lightning.png',
        'images/moon.png'
      ]);

      const textures = {
        raindrop: PIXI.Assets.get('images/raindrop.png'),
        heart: PIXI.Assets.get('images/heart.png'),
        background: PIXI.Assets.get('images/background.png'),
        house: PIXI.Assets.get('images/house.png'),
        dayhouse: PIXI.Assets.get('images/dayhouse.png'),
        lightning: PIXI.Assets.get('images/lightning.png'),
        moon: PIXI.Assets.get('images/moon.png')
      };

      // Initialize components
      const rainDrop = new RainDrop(app, textures.raindrop);
      const rainSound = new Sound('sounds/rain.mp3', true);
      const thunderSound = new Sound('sounds/thunder.mp3');
      const lightning = new Lightning(app, textures.lightning, thunderSound);
      const sun = new Sun(app, textures.moon);
      const backgroundDay = new Background(app, textures.dayhouse, false);
      const background = new Background(app, textures.house);

      setComponents({
        rainDrop,
        rainSound,
        thunderSound,
        lightning,
        background,
        backgroundDay,
        sun
      });

      // Start visual effects
      rainDrop.createMultiple(50);
      lightning.startWeatherEffects();
      sun.startEffect();

      // Heart click handler
      app.stage.eventMode = 'static';
      app.stage.on('pointerdown', async (event) => {
        const heart = new PIXI.Sprite(textures.heart);
        heart.zIndex = 1000;
        heart.anchor.set(0.5);
        heart.position.copyFrom(event.global);
        heart.scale.set(1);
        heart.alpha = 0;
        app.stage.addChild(heart);


        gsap.timeline()
        .to(heart, {
          alpha: 0.5,
          scale: 0.1,
          duration: 0.1,
          ease: 'power1.out',
        })
        .to(heart, {
          duration: 0.1,
          ease: 'power1.out',
          onComplete: () => {
            setTimeout(() => {
              app.stage.removeChild(heart);
            }, 2000);
          }
        });
      });
    };

    initializeApp();

    // Cleanup
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  const handlePlaySound = () => {
    if (components.rainSound) {
      components.rainSound.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleThunder = () => {
    if (components.lightning) {
      components.lightning.toggleInteraction();
      setIsThunderEnabled(!isThunderEnabled);
    }
  };

  const handleToggleSun = () => {
    if (components.sun) {
      components.sun.toggleVisibility();
      setIsSunEnabled(!isSunEnabled);
    }
  };

  const handleToggleBackground = () => {
    if (components.background && components.backgroundDay) {
      components.background.toggleVisibility();
      components.backgroundDay.toggleVisibility();

      if(components.backgroundDay.getVisibility() &&  components.lightning && components.lightning.getVisibility()) {
        handleToggleThunder();
      } 

      setIsNight(!isNight);
    }
  };

  return (
    <div>
      <div ref={canvasRef} />
      <ControlsContainer  className='controls-container'>
        <StyledButton onClick={handlePlaySound}>
          {isPlaying ? 'Pause Sound' : 'Play Sound'}
        </StyledButton>
        <StyledButton onClick={handleToggleThunder}>
          {isThunderEnabled? 'Disable Thunder' : 'Enable Thunder'}
        </StyledButton>
        <StyledButton onClick={handleToggleSun}>
          {isSunEnabled ? 'Disable Moon' : 'Enable Moon'}
        </StyledButton>
        <StyledButton onClick={handleToggleBackground}>
          {isNight ? 'Day Mood' : 'Night Mood'}
        </StyledButton>
      </ControlsContainer>
    </div>
  );
}

export default App; 