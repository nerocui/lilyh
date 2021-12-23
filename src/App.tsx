import React, { useCallback, useEffect, useRef, useState } from "react";
import FluidAnimation from "./react-fluid-animation";
import random from "random/dist/cjs/index";
import { FlappyBird } from "./flappy-bird/game";

const defaultConfig = {
  textureDownsample: 1,
  densityDissipation: 0.98,
  velocityDissipation: 0.99,
  pressureDissipation: 0.8,
  pressureIterations: 25,
  curl: 30,
  splatRadius: 0.005
};

export const App = () => {
  const config = defaultConfig;
  const animationRef = useRef<any>();
  const clickTime = useRef(0);
  const reset = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.addRandomSplats(random.int(100, 180));
    }
  }, [animationRef]);
  const setAnimation = useCallback((ref: any) => {
    animationRef.current = ref;
    reset();
  },[reset, animationRef]);

  const [showGame, setShowGame] = useState(false);
  return (
    <div
        style={{
          height: "100vh"
        }}
        onClick={() => {
          if (showGame) return;
          clickTime.current++;
          if (clickTime.current > 8) {
            clickTime.current = 0;
            setShowGame(true);
          }
        }}
      >
        {
          !showGame && (
            <>
              <FluidAnimation config={config} animationRef={setAnimation} />
              <div
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "1em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontFamily: 'Quicksand, "Helvetica Neue", sans-serif',
                  pointerEvents: "none"
                }}
              >
                <h1
                  style={{
                    fontSize: "3em",
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)"
                  }}
                >
                  Hi there,
                </h1>
                <h1
                  style={{
                    fontSize: "3em",
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)"
                  }}
                >
                  looking for something about me? Well, keep looking...
                </h1>
              </div>
            </>
          )
        }
        {showGame && 
          <div
            style={{
              zIndex: 99,
              height: '100%',
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              gap: "1rem"
            }}>
            <FlappyBird/>
            <button
              style={{
                width: "184px",
                height: "36px",
                backgroundColor: "red",
                borderRadius: "1rem",
                border: "none",
                fontSize: "1.2rem"
              }}
              onClick={() => setShowGame(false)}>
              Close
            </button>
          </div>
        }
      </div>
  );
};
