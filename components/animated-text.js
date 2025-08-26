class AnimatedText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPhase = 0; // 0: hidden, 1: ghostly, 2: heavenly
    this.intervalDuration = 4000; // 4 seconds per cycle
  }

  connectedCallback() {
    this.render();
    this.startAnimation();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 18vh; /* adjust as needed so it takes real vertical space */
        box-sizing: border-box;
        padding: 1rem 0;
        text-align: center;
      }

      .text-container {
        /* no absolute positioning — let the container be in normal flow */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .ghostly-text,
      .heavenly-text {
        font-family: 'Georgia', serif;
        font-size: 2.5rem;
        opacity: 0;
        transition: all 1s ease-in-out;
        margin: 0.25rem 0;
        line-height: 1.2;
      }

      /* keep the rest of your animations exactly the same */
      .ghostly-text { color: rgba(255,255,255,0.7); text-shadow: 0 0 10px rgba(255,255,255,0.3); filter: blur(1px); }
      .ghostly-text.show { opacity: 1; animation: ghostly-float 3s ease-in-out; }

      .heavenly-text { color: #ffd700; font-weight: bold; text-shadow: 0 0 15px rgba(255,215,0,0.8); }
      .heavenly-text.show { opacity: 1; animation: heavenly-glow 3s ease-in-out; }

      @media (max-width: 768px) {
        .ghostly-text, .heavenly-text { font-size: 1.8rem; }
      }
      @media (max-width: 480px) {
        .ghostly-text, .heavenly-text { font-size: 1.4rem; }
      }
    </style>
    <div class="text-container">
      <div class="ghostly-text">You want a thing that does not exist</div>
      <div class="heavenly-text">Protheus will do it for you</div>
    </div>
  `;
  }

  startAnimation() {
    const ghostlyText = this.shadowRoot.querySelector(".ghostly-text");
    const heavenlyText = this.shadowRoot.querySelector(".heavenly-text");

    const animate = () => {
      // Reset all classes
      ghostlyText.classList.remove("show");
      heavenlyText.classList.remove("show");

      // Phase 1: Show ghostly text
      setTimeout(() => {
        ghostlyText.classList.add("show");
      }, 500);

      // Phase 2: Show heavenly text
      setTimeout(() => {
        heavenlyText.classList.add("show");
      }, 2500);

      // Phase 3: Hide both texts
      setTimeout(() => {
        ghostlyText.classList.remove("show");
        heavenlyText.classList.remove("show");
      }, 5500);
    };

    // Start immediately
    animate();

    // Repeat every 8 seconds
    setInterval(animate, 8000);
  }
}

customElements.define("animated-text", AnimatedText);
