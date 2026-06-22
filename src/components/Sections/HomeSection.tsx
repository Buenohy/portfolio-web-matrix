'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { WhiteRoom } from '@/components/models/WhiteRoom';
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// TextPlugin kept registered (may be useful in other components)
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ─── Characters used in the Matrix 1999 style scramble ────────────────────────
// Japanese Katakana (as seen in the movie) + numbers + technical symbols
const MATRIX_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789@#$%&*!?<>{}[]|/\\';

/**
 * Adds a Matrix 1999 style terminal scramble animation directly to a timeline.
 * Each character displays random glyphs before locking onto its final correct value,
 * creating the iconic movie decryption effect.
 *
 * ⚠️ CORRECT PATTERN: Use `tl.fromTo()` directly on the timeline instead of returning
 * an external tween with `paused: true`. Paused external tweens added via `.add()`
 * are NOT unpaused by GSAP in timelines with `repeat: -1` — causing blank text fields.
 *
 * The `fromTo` with `{ progress: 0 }` ensures that the initial state is reset
 * properly on every single loop iteration of the infinite timeline.
 *
 * @param tl        - The GSAP timeline receiving the tween
 * @param element   - The DOM element whose textContent will animate
 * @param finalText - The final plain text to be revealed
 * @param duration  - Total duration of the animation in seconds
 * @param position  - Timeline positioning (e.g., "+=0.3", "<+=0.5") — optional
 */
function addMatrixScramble(
  tl: gsap.core.Timeline,
  element: HTMLElement | null,
  finalText: string,
  duration: number,
  position?: gsap.Position
): void {
  if (!element) return;

  // Proxy object that GSAP will interpolate from 0 to 1
  // Using `fromTo` (not `to`) is ESSENTIAL: guarantees progress resets to 0
  // on every iteration of the parent timeline's `repeat: -1`.
  const obj = { progress: 0 };

  tl.fromTo(
    obj,
    { progress: 0 }, // From: always reset to 0 at the start of each loop
    {
      progress: 1,
      duration,
      ease: 'none', // Linear = constant typing speed, like a real terminal

      onUpdate() {
        // Number of characters permanently revealed so far
        const revealedCount = Math.floor(obj.progress * finalText.length);
        let display = '';

        for (let i = 0; i < finalText.length; i++) {
          if (i < revealedCount) {
            // ✅ Character is already locked to its final value
            display += finalText[i];
          } else if (finalText[i] === ' ' || finalText[i] === '\n') {
            // Preserve spaces and line breaks without scrambling them
            display += finalText[i];
          } else {
            // 🔀 Character is still random (Matrix scramble effect)
            display +=
              MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
        }

        element.textContent = display;
      },

      onComplete() {
        // Guarantee that the correct final text is shown when complete
        element.textContent = finalText;
      },
    },
    position
  );
}

type HomeSectionProps = {
  translations: {
    greeting: string;
    nameCreator: string;
    mainTitle: React.ReactNode;
    cvButton: string;
    avatarAriaLabel: string;
    avatarAlt: string;
  };
};

export default function HomeSection({ translations }: HomeSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  // Sync state with the global transition ready event
  useEffect(() => {
    // If the transition completed during a previous mount, set ready immediately
    if (typeof window !== 'undefined' && (window as any).__APP_READY__) {
      setIsAppReady(true);
      return;
    }

    const handleAppReady = () => setIsAppReady(true);
    window.addEventListener('app-ready', handleAppReady);

    return () => window.removeEventListener('app-ready', handleAppReady);
  }, []);

  // Screen resize listener
  useEffect(() => {
    const handleResize = () => {
      // If viewport is smaller than 768px (Tailwind 'md'), treat as mobile
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP and Scene Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Group>(null!);

  // Parent Ref (UI Layer) - Used in ScrollTrigger
  const uiLayerRef = useRef<HTMLDivElement>(null);

  // Children Refs - Used in Intro Animation
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Refs for Matrix effect on ALL text in the section
  const typingGreetingRef = useRef<HTMLHeadingElement>(null); // Green — Left, Line 1
  const typingNameRef = useRef<HTMLHeadingElement>(null); // White — Left, Line 2
  const typingRoleRef = useRef<HTMLHeadingElement>(null); // Green — Right, Line 1
  const typingTitleRef = useRef<HTMLHeadingElement>(null); // White — Right, Line 2

  // State to ensure GSAP only starts after the 3D model loads
  const [isLoaded, setIsLoaded] = useState(false);

  // ─── useGSAP #1: Intro Animation + Matrix Effect ───────────────────────────
  // Runs ONCE on mount.
  // IMPORTANT: Separate from the scroll hook to prevent `isLoaded` changes from killing
  // the intro animation or the matrix typing loop.
  useGSAP(
    () => {
      // --- 1. INTRO ANIMATION (Fades in when loaded) ---
      const introTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      introTl.fromTo(
        [textLeftRef.current, textRightRef.current],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, delay: 0.5 }
      );

      introTl.fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1 },
        '-=1'
      );

      // --- 2. MATRIX ANIMATION (Infinite typing/decryption loop) ---
      const matrixTl = gsap.timeline({
        repeat: -1, // Infinite loop
        delay: 2, // Wait for intro animation to complete before starting
      });

      // Read text content directly from DOM elements
      // IMPORTANT: DO NOT use `translations.nameCreator` directly here.
      // If the prop is a JSX Object, string coercion produces "[object Object]".
      // Reading element textContent guarantees we animate the actual rendered raw text.
      const greetingText = typingGreetingRef.current?.textContent?.trim() || '';
      const nameText = typingNameRef.current?.textContent?.trim() || '';
      const roleText = typingRoleRef.current?.textContent?.trim() || '';
      const titleText = typingTitleRef.current?.textContent?.trim() || '';

      // Step 1: Clear text content before each cycle
      matrixTl.call(() => {
        if (typingGreetingRef.current)
          typingGreetingRef.current.textContent = '';
        if (typingNameRef.current) typingNameRef.current.textContent = '';
        if (typingRoleRef.current) typingRoleRef.current.textContent = '';
        if (typingTitleRef.current) typingTitleRef.current.textContent = '';
      });

      // Step 2: LEFT SIDE — greeting followed by name
      addMatrixScramble(matrixTl, typingGreetingRef.current, greetingText, 3.0);
      // Soft overlay delay (0.6s) for smooth character transitions
      addMatrixScramble(
        matrixTl,
        typingNameRef.current,
        nameText,
        3.6,
        '<+=0.6'
      );

      // Step 3: RIGHT SIDE — role followed by title
      addMatrixScramble(
        matrixTl,
        typingRoleRef.current,
        roleText,
        3.0,
        '+=0.8'
      );
      addMatrixScramble(
        matrixTl,
        typingTitleRef.current,
        titleText,
        3.6,
        '<+=0.6'
      );

      // Step 4: Keep all completed text static on the screen
      matrixTl.to({}, { duration: 5 });

      // Step 5: Clear all text fields before looping
      matrixTl.call(() => {
        if (typingGreetingRef.current)
          typingGreetingRef.current.textContent = '';
        if (typingNameRef.current) typingNameRef.current.textContent = '';
        if (typingRoleRef.current) typingRoleRef.current.textContent = '';
        if (typingTitleRef.current) typingTitleRef.current.textContent = '';
      });

      // Pause briefly with a cleared screen before restarting the cycle
      matrixTl.to({}, { duration: 1.0 });
    },
    { scope: containerRef }
  );

  // ─── useGSAP #2: Scroll Animation ──────────────────────────────────────────
  // Separate hook so that modifications to `isLoaded` and `isAppReady` do not kill
  // the intro animation or the already running Matrix loop.
  useGSAP(
    () => {
      // --- 3. SCROLL ANIMATION (Rotate and zoom into the TV screen) ---
      // ONLY initialize ScrollTrigger when the 3D model is loaded AND the scale-95 layout animation is fully finished.
      if (!isLoaded || !isAppReady || !sceneRef.current) return;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=500%', // Makes transition longer and smoother
          scrub: 3, // Weight/inertia for the scroll tracking
          pin: true, // Lock the section on the viewport
        },
      });

      scrollTl
        // 1. Rotation: From facing away (Math.PI) to front (0)
        .fromTo(
          sceneRef.current.rotation,
          { y: Math.PI },
          { y: 0, ease: 'none' }
        )
        // 2. Fade out UI text elements via parent container
        .to(uiLayerRef.current, { opacity: 0, y: -150, ease: 'none' }, 0)
        // 3. Dive-in: Scale Z position to "pass through" the camera plane
        .to(
          sceneRef.current.position,
          {
            z: 28, // Depth needed to fully clear viewport
            y: isMobile ? 1 : 0, // Align center of the screen with camera coordinates
            ease: 'power2.in',
          },
          '>'
        )
        // 4. Black overlay transition fade-in
        .to('.overlay-black', { opacity: 1, duration: 0.1 });

      // Recalculate ScrollTrigger start/end math after layout transitions are fully completed
      ScrollTrigger.refresh();
    },
    { dependencies: [isLoaded, isAppReady], scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen w-full max-w-full overflow-hidden"
    >
      {/* Black transition layer at the end of the scroll zoom animation */}
      <div className="overlay-black pointer-events-none absolute inset-0 z-20 opacity-0" />

      {/* 1. 3D LAYER (Background) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <ambientLight intensity={1.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <pointLight position={[-10, -10, -10]} intensity={1} />

          <Environment preset="city" />

          <Suspense fallback={null}>
            {/* sceneRef starts with 180 degrees (Math.PI) rotation */}
            <group ref={sceneRef} rotation={[0, Math.PI, 0]}>
              <Center top position={[0, isMobile ? -1 : -2.0, 0]}>
                <WhiteRoom scale={isMobile ? 1 : 2.5} />
              </Center>
            </group>

            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.4}
              scale={15}
              blur={2}
              far={4.5}
            />

            {/* Helper component notifying model loading completion */}
            <SceneInit onReady={() => setIsLoaded(true)} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. INTERFACE LAYER (Text & Buttons) */}
      <div
        ref={uiLayerRef}
        className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 py-20 md:px-12"
      >
        <div className="mt-32 flex w-full flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          {/* LEFT SIDE */}
          <div ref={textLeftRef} className="max-w-md opacity-0">
            {/*
              typingGreetingRef — Green greeting.
              Animated using Matrix scramble effect.
              min-h-[28px] prevents layout shifting.
            */}
            <h1
              ref={typingGreetingRef}
              className="text-green-matrix min-h-[28px] text-xl font-light tracking-tighter"
            >
              {translations.greeting}
            </h1>

            {/*
              typingNameRef — Creator name in uppercase bold white.
              Scrambled in right after the greeting sequence.
              min-h-[36px] (md: min-h-[48px]) holds vertical space.
            */}
            <h1
              ref={typingNameRef}
              className="text-white-matrix mt-1 min-h-[36px] text-2xl font-bold tracking-tighter uppercase md:min-h-[48px] md:text-4xl"
            >
              {translations.nameCreator}
            </h1>
          </div>

          {/* RIGHT SIDE */}
          <div
            ref={textRightRef}
            className="max-w-xl text-left opacity-0 md:text-right"
          >
            {/*
              typingRoleRef — "A Full Stack" in green.
              Animated following completion of the left side.
              min-h-[28px] prevents vertical shifting.
            */}
            <h2
              ref={typingRoleRef}
              className="text-green-matrix min-h-[28px] text-xl leading-tight font-light"
            >
              A Full Stack
            </h2>

            {/*
              typingTitleRef — "Software Engineer" in bold white.
              `whitespace-pre-line` is critical: enables real line breaks (\n) 
              inserted by the scramble timeline textContent update.
              min-h-[60px] holds space for multiple lines across resolutions.
            </h2>
            */}
            <h2
              ref={typingTitleRef}
              className="text-white-matrix mt-1 min-h-[60px] text-2xl leading-tight font-bold whitespace-pre-line uppercase md:min-h-[80px] md:text-4xl"
            >
              {'Software\nEngineer'}
            </h2>
          </div>
        </div>

        {/* BUTTON CONTAINER */}
        <div
          ref={buttonRef}
          className="pointer-events-auto flex w-full justify-center opacity-0 md:justify-start"
        >
          <DownloadCVButton text={translations.cvButton} />
        </div>
      </div>
    </section>
  );
}

/**
 * Small helper component detecting when R3F loading finishes
 * inside React Suspense to safely trigger GSAP animations.
 */
function SceneInit({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}
