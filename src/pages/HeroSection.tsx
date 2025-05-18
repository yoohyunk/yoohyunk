import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene3D from "../components/Scene3D";

// Set to true to always show the popup in development mode
const ALWAYS_SHOW_POPUP = true;

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [typedText1, setTypedText1] = useState("");
  const [typedText2, setTypedText2] = useState("");
  const [isTyping1Done, setIsTyping1Done] = useState(false);
  const [isTyping2Done, setIsTyping2Done] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorClicked, setCursorClicked] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);

  const text1 = "Hello world!";
  const text2 =
    "I'm Yoohyun Kim, a developer who loves to build things that matter.";

  // Check whether to show popup on page load
  useEffect(() => {
    // Reset localStorage in development mode
    if (ALWAYS_SHOW_POPUP) {
      localStorage.removeItem("hasSeenIntro");
    }

    // Check development mode or localStorage
    if (ALWAYS_SHOW_POPUP || !localStorage.getItem("hasSeenIntro")) {
      // Show popup
      setShowPopup(true);
      setShowFinalText(false);
    } else {
      // If already visited, show final text immediately
      setShowPopup(false);
      setShowFinalText(true);
    }

    console.log(
      "localStorage hasSeenIntro:",
      localStorage.getItem("hasSeenIntro")
    );
    console.log(
      "showPopup:",
      !localStorage.getItem("hasSeenIntro") || ALWAYS_SHOW_POPUP
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-100px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // First text typing animation
  useEffect(() => {
    if (!isVisible || !showPopup || typedText1.length === text1.length) return;

    const timeout = setTimeout(() => {
      setTypedText1(text1.slice(0, typedText1.length + 1));
    }, 100);

    return () => clearTimeout(timeout);
  }, [isVisible, typedText1, text1, showPopup]);

  // Check if first text typing is complete
  useEffect(() => {
    if (typedText1.length === text1.length) {
      setIsTyping1Done(true);
    }
  }, [typedText1, text1]);

  // Second text typing animation
  useEffect(() => {
    if (!isTyping1Done || typedText2.length === text2.length) return;

    const timeout = setTimeout(() => {
      setTypedText2(text2.slice(0, typedText2.length + 1));
    }, 50);

    return () => clearTimeout(timeout);
  }, [isTyping1Done, typedText2, text2]);

  // Check if second text typing is complete
  useEffect(() => {
    if (typedText2.length === text2.length) {
      setIsTyping2Done(true);
    }
  }, [typedText2, text2]);

  // Cursor animation after typing is complete
  useEffect(() => {
    if (!isTyping2Done || !showPopup) return;

    // Start cursor in the center
    setTimeout(() => {
      setShowCursor(true);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Position cursor at the bottom of the popup
        setCursorPosition({
          x: rect.width / 2,
          y: rect.height / 2 + 80,
        });
      }

      // Move cursor to the X button
      setTimeout(() => {
        if (closeButtonRef.current) {
          const buttonRect = closeButtonRef.current.getBoundingClientRect();
          setCursorPosition({
            x: buttonRect.left + buttonRect.width / 2 - 15, // Adjust arrow tip to center of button
            y: buttonRect.top + buttonRect.height / 2 - 5,
          });

          // Click effect after reaching the button
          setTimeout(() => {
            setCursorClicked(true);

            // Close popup after click effect
            setTimeout(() => {
              setShowPopup(false);

              // Save visit record
              localStorage.setItem("hasSeenIntro", "true");
              console.log("Saving to localStorage, hasSeenIntro:", true);

              // Hide cursor after popup closes
              setTimeout(() => {
                setShowCursor(false);
                // Show final text
                setShowFinalText(true);
              }, 500);
            }, 300);
          }, 800);
        }
      }, 1000);
    }, 800);
  }, [isTyping2Done, showPopup]);

  // Manually close popup (for development)
  const handleCloseClick = () => {
    setShowPopup(false);
    setShowCursor(false);
    localStorage.setItem("hasSeenIntro", "true");
    setShowFinalText(true);
  };

  return (
    <>
      <style>
        {`
          .popup-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            perspective: 1000px;
          }
          
          @keyframes bottomPullIn {
            0% { 
              transform: translate(0, 100%) scale(0.6);
              opacity: 0;
            }
            25% {
              opacity: 1;
            }
            85% { 
              transform: translate(0, 0) scale(1.02);
            }
            100% { 
              transform: translate(0, 0) scale(1);
            }
          }
          .animate-blink {
            animation: blink 0.8s infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .cursor-pulse {
            transform: scale(0.9);
            filter: brightness(1.5);
          }
          .cursor-container {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <section
        ref={sectionRef}
        className={`h-screen w-full relative bg-[#0a0a0c] overflow-hidden transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 3.2], fov: 32 }}
            className="w-full h-full"
          >
            <color attach="background" args={["#0a0a0c"]} />
            <ambientLight intensity={1.3} />
            <pointLight position={[5, 5, 5]} intensity={1.4} />
            <pointLight position={[-5, -5, -5]} intensity={0.7} />
            <Suspense fallback={null}>
              <Scene3D />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.2}
                minAzimuthAngle={-Math.PI / 6}
                maxAzimuthAngle={Math.PI / 6}
                rotateSpeed={0.3}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* 최종 텍스트 */}
        {showFinalText && (
          <div
            className="absolute bottom-20 left-0 right-0 text-center z-10"
            style={{ animation: "fadeInUp 1s ease-out" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white">
              Hello, it's <span className="text-purple-400">Yoohyun's</span>{" "}
              Portfolio
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Full-stack developer passionate about creating amazing experiences
            </p>
          </div>
        )}

        {showPopup && (
          <div className="popup-container">
            <div
              ref={popupRef}
              className="bg-white text-black p-6 rounded-lg shadow-xl w-[500px] max-w-[90%]"
              style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                animation:
                  "bottomPullIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
                transformOrigin: "bottom center",
              }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500">portfolio.dev</div>
                <div
                  ref={closeButtonRef}
                  className={`w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded ${
                    cursorClicked ? "bg-gray-200" : ""
                  }`}
                  onClick={handleCloseClick}
                >
                  ✕
                </div>
              </div>
              <div className="min-h-[100px]">
                <p className="text-lg font-medium mb-2">
                  {typedText1}
                  <span
                    className={`inline-block w-[2px] h-[14px] bg-black ml-[2px] ${
                      isTyping1Done ? "hidden" : "animate-blink"
                    }`}
                  ></span>
                </p>
                {isTyping1Done && (
                  <p className="text-base text-gray-700">
                    {typedText2}
                    <span
                      className={`inline-block w-[2px] h-[14px] bg-black ml-[2px] ${
                        isTyping2Done ? "hidden" : "animate-blink"
                      }`}
                    ></span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 마우스 커서 애니메이션 - 화살표 모양 */}
        {showCursor && (
          <div
            className={`absolute z-30 pointer-events-none cursor-container ${
              cursorClicked ? "cursor-pulse" : ""
            }`}
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              width: "40px",
              height: "40px",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 큰 화살표 커서 */}
              <path
                d="M12 36L4 4L36 20L22 22L12 36Z"
                fill="white"
                stroke="black"
                strokeWidth="1.5"
              />
              {/* 클릭 효과용 원 */}
              {cursorClicked && (
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.6"
                  strokeDasharray="4 2"
                />
              )}
            </svg>
          </div>
        )}
      </section>
    </>
  );
}
