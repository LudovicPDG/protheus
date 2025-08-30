// Create matrix digital squares
function createMatrixSquares() {
  const matrixContainer = document.getElementById("matrix-squares");
  const squareCount = 30;

  for (let i = 0; i < squareCount; i++) {
    const square = document.createElement("div");
    square.className = "matrix-square";
    square.style.left = Math.random() * 100 + "%";
    square.style.animationDelay = Math.random() * 15 + "s";
    square.style.animationDuration = 15 + Math.random() * 10 + "s";

    // Random size variations
    const size = 15 + Math.random() * 15;
    square.style.width = size + "px";
    square.style.height = size + "px";

    matrixContainer.appendChild(square);
  }
}

// Handle footer prompt submissions
document.addEventListener("prompt-submitted", (event) => {
  const prompt = event.detail.prompt;
  console.log("User submitted prompt:", prompt);

  // Matrix-style response
  alert(
    `> PROTHEUS SYSTEM ACTIVATED\n> ANALYZING REQUEST: "${prompt}"\n> STATUS: PROCESSING...\n> RESULT: IMPOSSIBLE MADE POSSIBLE`
  );
});

// Initialize matrix squares when page loads
document.addEventListener("DOMContentLoaded", () => {
  createMatrixSquares();
});

// Matrix-style mouse interaction
document.addEventListener("mousemove", (e) => {
  const cursor = { x: e.clientX, y: e.clientY };
  const squares = document.querySelectorAll(".matrix-square");

  squares.forEach((square, index) => {
    if (index % 2 === 0) {
      const rect = square.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(cursor.x - (rect.x + rect.width / 2), 2) +
          Math.pow(cursor.y - (rect.y + rect.height / 2), 2)
      );

      if (distance < 150) {
        const intensity = 1 - distance / 150;
        square.style.boxShadow = `0 0 ${intensity * 20}px rgba(0, 255, 65, ${
          intensity * 0.8
        })`;
        square.style.borderColor = `rgba(0, 255, 65, ${0.3 + intensity * 0.7})`;
      } else {
        square.style.boxShadow = "";
        square.style.borderColor = "";
      }
    }
  });
});
