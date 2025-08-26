class InteractiveFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPlaceholderIndex = 0;
    this.placeholders = [
      "Website That Predicts Your Future",
      "Infinite Website",
      "Time-Traveling Webpage",
      "Mind-Reading Application",
      "Reality-Bending Platform",
      "Quantum Computing Interface",
      "Parallel Universe Portal",
    ];
    this.isTyping = false;
  }

  connectedCallback() {
    this.render();
    this.startPlaceholderAnimation();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            180deg,
            rgba(106, 0, 255, 0) 0%,
            rgba(106, 0, 255, 0.8) 50%,
            rgba(86, 0, 205, 1) 100%
          );
          padding: 2rem;
          z-index: 1000;
        }

        .footer-container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .input-container:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .input-container.focused {
          border-color: rgba(255, 215, 0, 0.6);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .prompt-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .prompt-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s ease;
        }

        .prompt-input:focus::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .submit-button {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin-right: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .submit-button:active {
          transform: scale(0.95);
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-left: 8px solid #6a00ff;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          transform: translate(-30%, -50%);
        }

        .typing-indicator {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%);
          display: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .typing-indicator.show {
          display: block;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .placeholder-animation {
          position: absolute;
          top: 50%;
          left: 1.5rem;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1rem;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          width: calc(100% - 120px);
        }

        .placeholder-text {
          display: inline-block;
          border-right: 2px solid rgba(255, 255, 255, 0.6);
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { border-color: rgba(255, 255, 255, 0.6); }
          51%, 100% { border-color: transparent; }
        }

        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }

          .prompt-input {
            font-size: 1rem;
            padding: 0.8rem 1rem;
          }

          .placeholder-animation {
            font-size: 1rem;
            left: 1rem;
            width: calc(100% - 100px);
          }
        }
      </style>
      <div class="footer-container">
        <div class="input-container">
          <div class="placeholder-animation">
            <span class="placeholder-text"></span>
          </div>
          <input 
            type="text" 
            class="prompt-input" 
            placeholder=""
          />
          <div class="typing-indicator">...</div>
          <button class="submit-button" type="submit"></button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector(".prompt-input");
    const container = this.shadowRoot.querySelector(".input-container");
    const button = this.shadowRoot.querySelector(".submit-button");
    const placeholder = this.shadowRoot.querySelector(".placeholder-animation");

    input.addEventListener("focus", () => {
      container.classList.add("focused");
      placeholder.style.display = "none";
    });

    input.addEventListener("blur", () => {
      container.classList.remove("focused");
      if (!input.value) {
        placeholder.style.display = "block";
      }
    });

    input.addEventListener("input", () => {
      if (input.value) {
        placeholder.style.display = "none";
      } else {
        placeholder.style.display = "block";
      }
    });

    button.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleSubmit(input.value);
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSubmit(input.value);
      }
    });
  }

  handleSubmit(value) {
    if (!value.trim()) return;

    // Dispatch custom event with the input value
    this.dispatchEvent(
      new CustomEvent("prompt-submitted", {
        detail: { prompt: value.trim() },
        bubbles: true,
      })
    );

    // Clear input
    const input = this.shadowRoot.querySelector(".prompt-input");
    input.value = "";

    // Show placeholder again
    const placeholder = this.shadowRoot.querySelector(".placeholder-animation");
    placeholder.style.display = "block";

    // Add visual feedback
    const button = this.shadowRoot.querySelector(".submit-button");
    button.style.background = "linear-gradient(45deg, #00ff00, #32ff32)";
    setTimeout(() => {
      button.style.background = "linear-gradient(45deg, #ffd700, #ffed4e)";
    }, 200);
  }

  async startPlaceholderAnimation() {
    const placeholderElement =
      this.shadowRoot.querySelector(".placeholder-text");

    while (true) {
      const currentText = this.placeholders[this.currentPlaceholderIndex];

      // Type out the text
      await this.typeText(placeholderElement, currentText);

      // Wait before erasing
      await this.wait(2000);

      // Erase the text
      await this.eraseText(placeholderElement);

      // Wait before next text
      await this.wait(500);

      // Move to next placeholder
      this.currentPlaceholderIndex =
        (this.currentPlaceholderIndex + 1) % this.placeholders.length;
    }
  }

  async typeText(element, text) {
    element.textContent = "";
    for (let i = 0; i <= text.length; i++) {
      element.textContent = text.substring(0, i);
      await this.wait(50 + Math.random() * 50); // Variable typing speed
    }
  }

  async eraseText(element) {
    const text = element.textContent;
    for (let i = text.length; i >= 0; i--) {
      element.textContent = text.substring(0, i);
      await this.wait(30);
    }
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

customElements.define("interactive-footer", InteractiveFooter);
