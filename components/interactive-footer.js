class InteractiveFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPlaceholderIndex = 0;
    const raw = this.getAttribute("placeholders");
    console.log("Raw placeholders attribute:", raw);
    if (raw) {
      try {
        this.placeholders = JSON.parse(decodeURIComponent(raw));
      } catch (e) {
        console.warn("Invalid placeholders JSON", e);
        this.placeholders = [];
      }
    }
    console.log("InteractiveFooter placeholders:", this.placeholders);
  }
  connectedCallback() {
    this.render();
    this.startPlaceholderAnimation();
  }

  // Method to update placeholders with translations
  updatePlaceholders(newPlaceholders) {
    this.placeholders = newPlaceholders;
    this.currentPlaceholderIndex = 0; // Reset index
  }

  render() {
    const t = window.currentTranslation || window.translations?.en || {};
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 20, 0, 0.8) 50%,
            rgba(0, 40, 0, 1) 100%
          );
          padding: 2rem;
          z-index: 1000;
          border-top: 1px solid rgba(0, 255, 65, 0.2);
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
          background: rgba(0, 20, 0, 0.6);
          border-radius: 8px;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(0, 255, 65, 0.3);
          transition: all 0.3s ease;
          box-shadow: 
            inset 0 0 20px rgba(0, 255, 65, 0.1),
            0 0 20px rgba(0, 255, 65, 0.1);
        }

        .input-container:hover {
          border-color: rgba(0, 255, 65, 0.5);
          background: rgba(0, 30, 0, 0.7);
          box-shadow: 
            inset 0 0 30px rgba(0, 255, 65, 0.15),
            0 0 30px rgba(0, 255, 65, 0.2);
        }

        .input-container.focused {
          border-color: rgba(0, 255, 65, 0.8);
          background: rgba(0, 40, 0, 0.8);
          box-shadow: 
            inset 0 0 40px rgba(0, 255, 65, 0.2),
            0 0 40px rgba(0, 255, 65, 0.3),
            0 0 80px rgba(0, 255, 65, 0.1);
        }

        .prompt-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          color: #00ff41;
          font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
          letter-spacing: 0.5px;
        }

        .prompt-input::placeholder {
          color: rgba(0, 255, 65, 0.4);
          transition: color 0.3s ease;
        }

        .prompt-input:focus::placeholder {
          color: rgba(0, 255, 65, 0.2);
        }

        .submit-button {
          background: linear-gradient(45deg, #00ff41, #00cc33);
          border: 2px solid rgba(0, 255, 65, 0.5);
          border-radius: 8px;
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
          box-shadow: 
            inset 0 0 10px rgba(0, 255, 65, 0.3),
            0 0 10px rgba(0, 255, 65, 0.2);
        }

        .submit-button:hover {
          transform: scale(1.05);
          box-shadow: 
            inset 0 0 20px rgba(0, 255, 65, 0.5),
            0 0 20px rgba(0, 255, 65, 0.4),
            0 0 40px rgba(0, 255, 65, 0.2);
          border-color: rgba(0, 255, 65, 0.8);
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
          border-left: 8px solid #000;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          transform: translate(-30%, -50%);
        }

        .placeholder-animation {
          position: absolute;
          top: 50%;
          left: 1.5rem;
          transform: translateY(-50%);
          color: rgba(0, 255, 65, 0.6);
          font-size: 1.1rem;
          font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          width: calc(100% - 120px);
          letter-spacing: 0.5px;
        }

        .placeholder-text {
          display: inline-block;
          border-right: 2px solid rgba(0, 255, 65, 0.8);
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { border-color: rgba(0, 255, 65, 0.8); }
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
          <button class="submit-button" type="submit"></button>
        </div>
      </div>
    `;

    this.setupEventListeners();

    // Update placeholders with current translations
    if (t.footer?.placeholders) {
      this.updatePlaceholders(t.footer.placeholders);
    }
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

    this.dispatchEvent(
      new CustomEvent("prompt-submitted", {
        detail: { prompt: value.trim() },
        bubbles: true,
      })
    );

    const input = this.shadowRoot.querySelector(".prompt-input");
    input.value = "";

    const placeholder = this.shadowRoot.querySelector(".placeholder-animation");
    placeholder.style.display = "block";

    const button = this.shadowRoot.querySelector(".submit-button");
    button.style.background = "linear-gradient(45deg, #00ffff, #00cccc)";
    button.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.8)";
    setTimeout(() => {
      button.style.background = "linear-gradient(45deg, #00ff41, #00cc33)";
      button.style.boxShadow = "";
    }, 300);
  }

  async startPlaceholderAnimation() {
    const placeholderElement =
      this.shadowRoot.querySelector(".placeholder-text");

    while (true) {
      const currentText = this.placeholders[this.currentPlaceholderIndex];

      await this.typeText(placeholderElement, currentText);
      await this.wait(2000);
      await this.eraseText(placeholderElement);
      await this.wait(500);

      this.currentPlaceholderIndex =
        (this.currentPlaceholderIndex + 1) % this.placeholders.length;
    }
  }

  async typeText(element, text) {
    element.textContent = "";
    for (let i = 0; i <= text.length; i++) {
      element.textContent = text.substring(0, i);
      await this.wait(50 + Math.random() * 50);
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
