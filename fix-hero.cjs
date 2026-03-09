const fs = require("fs");

// 1. Fix page.tsx — h1 sizes
let page = fs.readFileSync("app/page.tsx", "utf8");

// Replace h1 className (robust regex)
page = page.replace(
  /(<h1\s+className=")[^"]*gradient-text[^"]*(")/,
  '$1font-display text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[12rem] font-bold gradient-text hero-name mb-8 leading-[0.85] tracking-tight$2'
);

// Greeting closer to name
page = page.replace(/mb-4 italic/g, "mb-2 italic");

fs.writeFileSync("app/page.tsx", page, "utf8");

if (page.includes("text-[12rem]")) {
  console.log("OK page.tsx — new sizes applied");
} else {
  console.log("FAIL — regex did not match!");
}

// 2. Add glow CSS if not already there
let css = fs.readFileSync("app/globals.css", "utf8");
if (!css.includes(".hero-name")) {
  css += `
/* -- Hero Name Glow ----------------------------------------- */
.hero-name {
  animation: hero-glow 6s ease-in-out infinite;
}

@keyframes hero-glow {
  0%, 100% {
    filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))
            drop-shadow(0 0 80px rgba(245, 158, 11, 0.1));
  }
  50% {
    filter: drop-shadow(0 0 60px rgba(168, 85, 247, 0.5))
            drop-shadow(0 0 100px rgba(245, 158, 11, 0.25));
  }
}
`;
  fs.writeFileSync("app/globals.css", css, "utf8");
  console.log("OK globals.css — glow added");
} else {
  console.log("OK globals.css — glow already exists");
}
