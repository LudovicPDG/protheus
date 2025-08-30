import en from "./lang/en.js";

function unwrapModule(mod) {
  // Accept either the module namespace or a direct object
  return mod && (mod.default ?? mod);
}

async function createIndexHtml(lang = "en") {
  let trad;
  if (lang === "en") {
    trad = en;
  } else {
    const mod = await import(`./lang/${lang}.js`).catch(() => en);
    trad = unwrapModule(mod);
  }

  const placeholdersJson = encodeURIComponent(
    JSON.stringify(trad.placeholders)
  );

  console.log("Using English translations as default:", trad);
  console.log("reste", trad.title, trad.ghostlyText, trad.heavenlyText);
  console.log("placeholders", placeholdersJson);
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${trad.title}</title>
    <meta name="description" content="${trad.metaDescription}" />
    <meta name="keywords" content="${trad.metaKeywords}" />  
    <link rel="stylesheet" href="gloabal.css" />
  </head>
  <body>
    <!-- Matrix digital squares -->
    <div class="matrix-squares" id="matrix-squares"></div>

    <main>
      <div class="main-content">
        <glitched-question></glitched-question>
        <animated-text ghostlyText="${trad.ghostlyText}" heavenlyText="${trad.heavenlyText}"></animated-text>
      </div>
    </main>

    <interactive-footer placeholders="${placeholdersJson}"></interactive-footer>

    <script src="script.js"></script>

    <!-- Import web components -->
    <script src="components/glitched-question.js"></script>
    <script src="components/animated-text.js"></script>
    <script src="components/interactive-footer.js"></script>
  </body>
</html>
`;
}

export default createIndexHtml;
