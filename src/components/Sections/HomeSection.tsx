"use client"

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { WhiteRoom } from '@/components/models/WhiteRoom'
import DownloadCVButton from '@/components/DownloadCvButton/DownloadCvButton'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// TextPlugin mantido registrado (pode ser útil em outros componentes)
import { TextPlugin } from 'gsap/TextPlugin'

// Registra os plugins do GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin)

// ─── Caracteres usados no embaralhamento estilo Matrix 1999 ───────────────────
// Katakana japonês (como no filme) + números + símbolos técnicos
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789@#$%&*!?<>{}[]|/\\"

/**
 * Adiciona diretamente à timeline um tween de embaralhamento estilo terminal Matrix 1999.
 * Cada caractere exibe aleatórios do alfabeto Matrix antes de fixar no valor correto,
 * criando o efeito de "decifração" icônico do filme.
 *
 * ⚠️ PADRÃO CORRETO: usa `tl.fromTo()` diretamente na timeline em vez de retornar
 * um tween externo com `paused: true`. Tweens externos pausados adicionados via `.add()`
 * NÃO são despauzados pelo GSAP em timelines com `repeat: -1` — causando textos em branco.
 *
 * O `fromTo` com `{ progress: 0 }` garante que o estado inicial seja restaurado
 * corretamente em cada repetição do loop infinito da timeline.
 *
 * @param tl        - A timeline GSAP que receberá o tween
 * @param element   - O elemento DOM cujo textContent será animado
 * @param finalText - O texto final que será revelado
 * @param duration  - Duração total da animação em segundos
 * @param position  - Posição na timeline (ex: "+=0.3", "<+=0.5") — opcional
 */
function addMatrixScramble(
  tl: gsap.core.Timeline,
  element: HTMLElement | null,
  finalText: string,
  duration: number,
  position?: gsap.Position
): void {
  // Não faz nada (de forma segura) se o elemento não existir
  if (!element) return

  // Objeto proxy que o GSAP vai interpolar de 0 → 1.
  // Usar `fromTo` (não `to`) é ESSENCIAL: garante que progress volta a 0
  // em cada repetição do `repeat: -1` da timeline pai.
  const obj = { progress: 0 }

  tl.fromTo(
    obj,
    { progress: 0 }, // from: sempre reseta para 0 no início de cada ciclo
    {
      progress: 1,
      duration,
      ease: "none", // Linear = ritmo constante, como um terminal real

      onUpdate() {
        // Quantos caracteres já foram definitivamente revelados
        const revealedCount = Math.floor(obj.progress * finalText.length)
        let display = ""

        for (let i = 0; i < finalText.length; i++) {
          if (i < revealedCount) {
            // ✅ Caractere já fixado no valor final
            display += finalText[i]
          } else if (finalText[i] === " " || finalText[i] === "\n") {
            // Preserva espaços e quebras de linha sem embaralhar
            display += finalText[i]
          } else {
            // 🔀 Caractere ainda aleatório (embaralhamento Matrix)
            display += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
          }
        }

        element.textContent = display
      },

      onComplete() {
        // Garante que o texto final correto seja exibido ao terminar
        element.textContent = finalText
      },
    },
    position
  )
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
  // 1. Cria o estado (começamos assumindo que não é mobile, ou seja, scale 2.5)
  const [isMobile, setIsMobile] = useState(false)

  // 2. Cria o ouvinte de tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      // Se a tela for menor que 768px (padrão 'md' do Tailwind), isMobile vira true
      setIsMobile(window.innerWidth < 768)
    }

    // Chama uma vez na montagem para pegar o tamanho inicial
    handleResize()

    // Adiciona o listener para caso o usuário gire o celular ou redimensione a janela
    window.addEventListener("resize", handleResize)

    // Limpa o listener quando o componente for destruído
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Refs do GSAP e da Cena
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Group>(null!)

  // Ref Pai (Camada da UI) - Usado no ScrollTrigger
  const uiLayerRef = useRef<HTMLDivElement>(null)

  // Refs Filhos - Usados na animação de Entrada
  const textLeftRef = useRef<HTMLDivElement>(null)
  const textRightRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Refs para o efeito Matrix em TODOS os textos da seção
  const typingGreetingRef = useRef<HTMLHeadingElement>(null) // Saudação verde (esquerda, topo)
  const typingNameRef = useRef<HTMLHeadingElement>(null)     // Nome branco  (esquerda, baixo)
  const typingRoleRef = useRef<HTMLHeadingElement>(null)     // "A Full Stack" verde (direita, topo)
  const typingTitleRef = useRef<HTMLHeadingElement>(null)    // "Software Engineer" branco (direita, baixo)

  // Estado para garantir que o GSAP só inicie após o modelo 3D carregar
  const [isLoaded, setIsLoaded] = useState(false)

  // ─── useGSAP #1: Animação de Entrada + Matrix ─────────────────────────────
  // Roda UMA VEZ ao montar o componente, sem dependências.
  // IMPORTANTE: separado do hook de scroll para que `isLoaded` não cause
  // re-execução (e consequente kill) da animação de entrada e do loop Matrix.
  useGSAP(() => {
    // --- 1. ANIMAÇÃO DE ENTRADA (Aparece ao carregar a página) ---
    // Anima os elementos filhos individualmente
    const introTl = gsap.timeline({ defaults: { ease: "power4.out" } })

    introTl.fromTo(
      [textLeftRef.current, textRightRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, delay: 0.5 }
    )

    introTl.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 },
      "-=1"
    )

    // --- 2. ANIMAÇÃO MATRIX (Estilo Terminal 1999 — Todos os textos) ---
    // Timeline em loop infinito que embaralha e revela cada texto em sequência,
    // simulando o efeito de decifração de caracteres do filme Matrix (1999).
    const matrixTl = gsap.timeline({
      repeat: -1, // Loop infinito
      delay: 2,   // Aguarda a animação de entrada terminar antes de iniciar
    })

    // ── Lê os textos diretamente do DOM após a renderização do React ────────
    // IMPORTANTE: NÃO usar `translations.nameCreator` diretamente aqui.
    // Se a prop for um React.ReactNode (objeto JSX), coerção para string
    // produziria "[object Object]" na tela. Ler o `textContent` do elemento
    // garante sempre a string de texto pura que o React já renderizou no DOM.
    const greetingText = typingGreetingRef.current?.textContent?.trim() || ""  // Verde — esquerda, linha 1
    const nameText     = typingNameRef.current?.textContent?.trim()     || ""  // Branco — esquerda, linha 2
    const roleText     = typingRoleRef.current?.textContent?.trim()     || ""  // Verde — direita, linha 1
    // titleText usa \n que funciona graças ao `whitespace-pre-line` no elemento
    const titleText    = typingTitleRef.current?.textContent?.trim()    || ""  // Branco — direita, linha 2

    // ── Passo 1: Limpa todos os textos no início de cada ciclo ──────────────
    matrixTl.call(() => {
      if (typingGreetingRef.current) typingGreetingRef.current.textContent = ""
      if (typingNameRef.current)     typingNameRef.current.textContent     = ""
      if (typingRoleRef.current)     typingRoleRef.current.textContent     = ""
      if (typingTitleRef.current)    typingTitleRef.current.textContent    = ""
    })

    // ── Passo 2: Lado ESQUERDO — greeting (verde) seguido de name (branco) ──
    // O greeting começa primeiro; addMatrixScramble adiciona o fromTo diretamente
    // na matrixTl, garantindo reset correto do `progress` em cada repeat.
    // Durações dobradas em relação ao original para ritmo mais lento e legível.
    addMatrixScramble(matrixTl, typingGreetingRef.current, greetingText, 3.0)
    // O name começa 0.6s depois do greeting, criando sobreposição suave
    addMatrixScramble(matrixTl, typingNameRef.current, nameText, 3.6, "<+=0.6")

    // ── Passo 3: Lado DIREITO — role (verde) seguido de title (branco) ──────
    // Pequena pausa após o lado esquerdo terminar, então o role começa
    addMatrixScramble(matrixTl, typingRoleRef.current, roleText, 3.0, "+=0.8")
    // O title começa 0.6s depois do role, mesma lógica de sobreposição
    addMatrixScramble(matrixTl, typingTitleRef.current, titleText, 3.6, "<+=0.6")

    // ── Passo 4: Aguarda com todos os textos completos e visíveis na tela ───
    matrixTl.to({}, { duration: 5 })

    // ── Passo 5: Apaga todos os textos antes de repetir o ciclo ─────────────
    matrixTl.call(() => {
      if (typingGreetingRef.current) typingGreetingRef.current.textContent = ""
      if (typingNameRef.current)     typingNameRef.current.textContent     = ""
      if (typingRoleRef.current)     typingRoleRef.current.textContent     = ""
      if (typingTitleRef.current)    typingTitleRef.current.textContent    = ""
    })

    // Pequena pausa de "tela limpa" antes do próximo ciclo de scramble
    matrixTl.to({}, { duration: 1.0 })

  }, { scope: containerRef }) // SEM dependencies — roda apenas uma vez ao montar

  // ─── useGSAP #2: Animação de Scroll ───────────────────────────────────────
  // Separado do hook acima para que a mudança de `isLoaded` não mate
  // a animação de entrada nem o loop Matrix que já estão rodando.
  useGSAP(() => {
    // --- 3. ANIMAÇÃO DE SCROLL (Giro e Mergulho na TV) ---
    // Só cria esta timeline se o modelo 3D (sceneRef) estiver pronto
    if (!isLoaded || !sceneRef.current) return

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%", // Deixa a animação mais longa e suave
        scrub: 3,      // Aumenta o "peso/inércia" da transição
        pin: true,     // Trava a seção na tela
      },
    })

    scrollTl
      // 1. Rotação: De costas (Math.PI) para frente (0)
      .fromTo(
        sceneRef.current.rotation,
        { y: Math.PI },
        { y: 0, ease: "none" }
      )
      // 2. Some com TODOS os textos e botão animando apenas a div "Pai"
      .to(
        uiLayerRef.current,
        { opacity: 0, y: -150, ease: "none" },
        0
      )
      // 3. Mergulho: Aumenta o Z para "atravessar" a câmera
      .to(
        sceneRef.current.position,
        {
          z: 28,               // Valor para atravessar a tela totalmente
          y: isMobile ? 1 : 0, // Alinhamento do centro da TV com a câmera
          ease: "power2.in",
        },
        ">"
      )
      // 4. Escurece a tela no final do mergulho para transição
      .to(".overlay-black", { opacity: 1, duration: 0.1 })

    // Atualiza o ScrollTrigger para garantir os cálculos corretos de altura
    ScrollTrigger.refresh()

  }, { dependencies: [isLoaded], scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen w-full max-w-full overflow-hidden"
    >
      {/* Camada de transição preta no final da animação */}
      <div className="overlay-black pointer-events-none absolute inset-0 z-20 opacity-0" />

      {/* 1. LAYER 3D (Fundo) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} />

          <Environment preset="city" />

          <Suspense fallback={null}>
            {/* O grupo sceneRef começa com rotação de 180 graus (costas) */}
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

            {/* Helper para avisar quando o Suspense terminar */}
            <SceneInit onReady={() => setIsLoaded(true)} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. LAYER DE INTERFACE (Textos) - Adicionado a ref do Pai (uiLayerRef) */}
      <div
        ref={uiLayerRef}
        className="pointer-events-none relative z-10 flex h-full w-full max-w-7xl flex-col justify-between px-6 py-20 md:px-12 mx-auto"
      >
        <div className="flex w-full flex-col items-start justify-between gap-10 md:flex-row md:items-center mt-32">

          {/* LADO ESQUERDO */}
          <div ref={textLeftRef} className="max-w-md opacity-0">
            {/*
              typingGreetingRef — Saudação em verde.
              Animado pelo efeito Matrix scramble (createMatrixScramble).
              min-h-[28px] evita que o layout "pule" quando o texto é apagado.
            */}
            <h1
              ref={typingGreetingRef}
              className="text-xl font-light text-green-matrix tracking-tighter min-h-[28px]"
            >
              {translations.greeting}
            </h1>

            {/*
              typingNameRef — Nome do criador em branco e negrito.
              Também animado com Matrix scramble após o greeting.
              min-h-[48px] (md: min-h-[56px]) reserva espaço para o texto em maiúsculas.
            */}
            <h1
              ref={typingNameRef}
              className="text-2xl font-bold text-white-matrix uppercase tracking-tighter md:text-4xl mt-1 min-h-[36px] md:min-h-[48px]"
            >
              {translations.nameCreator}
            </h1>
          </div>

          {/* LADO DIREITO */}
          <div ref={textRightRef} className="max-w-xl text-left md:text-right opacity-0">
            {/*
              typingRoleRef — "A Full Stack" em verde.
              Animado pelo efeito Matrix scramble após o lado esquerdo.
              min-h-[28px] evita colapso de layout.
            */}
            <h2
              ref={typingRoleRef}
              className="text-xl leading-tight text-green-matrix font-light min-h-[28px]"
            >
              A Full Stack
            </h2>

            {/*
              typingTitleRef — "Software Engineer" em branco e negrito.
              `whitespace-pre-line` é ESSENCIAL: permite que o \n usado no textContent
              pelo createMatrixScramble crie a quebra de linha real (substitui o <br/>
              original que não funciona com textContent do GSAP).
              min-h-[72px] reserva espaço para duas linhas em todas as resoluções.
            */}
            <h2
              ref={typingTitleRef}
              className="text-2xl font-bold leading-tight text-white-matrix uppercase md:text-4xl mt-1 min-h-[60px] md:min-h-[80px] whitespace-pre-line"
            >
              {"Software\nEngineer"}
            </h2>
          </div>
        </div>

        {/* BOTÃO (Centralizado ou Alinhado) */}
        <div
          ref={buttonRef}
          className="pointer-events-auto flex w-full justify-center md:justify-start opacity-0"
        >
          <DownloadCVButton text={translations.cvButton} />
        </div>
      </div>
    </section>
  )
}

/**
 * Pequeno componente helper para detectar quando o modelo 3D
 * dentro do Suspense foi montado, evitando que o GSAP trave.
 */
function SceneInit({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}