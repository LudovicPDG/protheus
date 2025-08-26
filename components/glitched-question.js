class GlitchedQuestion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // allow using <glitched-question>?</glitched-question> or attribute data-text
    const text =
      this.getAttribute("data-text") || this.textContent.trim() || "?";
    this.render(text);
    this.startGlitch();
  }

  render(text) {
    // clear potential light DOM text so it doesn't duplicate
    this.textContent = "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-size: clamp(48px, 8vw, 160px);
          line-height: 1;
          font-family: monospace, system-ui, monospace;
          color: white;
          position: relative;
          user-select: none;
        }

        .question {
          position: relative;
          display: inline-block;
          padding: 0;
          margin: 0;
          will-change: transform, opacity, clip-path;
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }

        /* base layer */
        .text {
          position: relative;
        }

        /* red & green offset layers */
        .copy {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          display: inline-block;
        }

        .copy.red {
          color: #ff4d4d;
          z-index: 2;
          mix-blend-mode: screen;
          transform: translate(0,0);
          opacity: 0.9;
        }

        .copy.green {
          color: #66ff99;
          z-index: 1;
          mix-blend-mode: screen;
          transform: translate(0,0);
          opacity: 0.9;
        }

        /* use clip-path (works on any positioned element) for slicing */
        @keyframes glitch-anim {
          0% {
            transform: none;
          }
          8% {
            transform: translateX(-2px) skewX(-0.6deg);
          }
          12% {
            transform: translateX(2px) skewX(0.6deg);
          }
          25% {
            transform: translateY(-2px) skewY(-0.6deg);
          }
          50% {
            transform: none;
          }
          75% {
            transform: translateX(1px) skewX(0.3deg);
          }
          100% {
            transform: none;
          }
        }

        @keyframes slice-red {
          0% { clip-path: inset(0 0 0 0); transform: translate(0,0); opacity: 0.9; }
          20% { clip-path: inset(30% 0 60% 0); transform: translate(-6px,-2px); opacity: 1; }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(6px,2px); opacity: 0.8; }
          60% { clip-path: inset(10% 0 70% 0); transform: translate(-4px,0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); transform: translate(0,0); opacity: 0.9; }
        }

        @keyframes slice-green {
          0% { clip-path: inset(0 0 0 0); transform: translate(0,0); opacity: 0.9; }
          15% { clip-path: inset(40% 0 40% 0); transform: translate(6px,1px); opacity: 1; }
          35% { clip-path: inset(5% 0 80% 0); transform: translate(-6px,-1px); opacity: 0.8; }
          70% { clip-path: inset(20% 0 50% 0); transform: translate(4px,0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); transform: translate(0,0); opacity: 0.9; }
        }

        /* apply animations to layer copies */
        .copy.red { animation: slice-red 0.9s infinite ease-in-out; }
        .copy.green { animation: slice-green 1.1s infinite ease-in-out; }

        /* small accessible fallback for very small screens */
        @media (max-width: 420px) {
          :host { font-size: 72px; }
        }
      </style>

      <div class="question" data-text="${text}">
        <span class="text">${text}</span>
        <span class="copy red" aria-hidden="true">${text}</span>
        <span class="copy green" aria-hidden="true">${text}</span>
      </div>
    `;
  }

  startGlitch() {
    // Extra jitter occasionally
    this._jitterInterval = setInterval(() => {
      const question = this.shadowRoot.querySelector(".question");
      if (!question) return;
      if (Math.random() < 0.08) {
        question.style.transition = "transform 0.08s";
        question.style.transform = `translate(${Math.random() * 6 - 3}px, ${
          Math.random() * 6 - 3
        }px) rotate(${Math.random() * 2 - 1}deg)`;
        setTimeout(() => {
          question.style.transform = "";
        }, 90);
      }
    }, 120);
  }

  disconnectedCallback() {
    if (this._jitterInterval) clearInterval(this._jitterInterval);
  }
}

customElements.define("glitched-question", GlitchedQuestion);
