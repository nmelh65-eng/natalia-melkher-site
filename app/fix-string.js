@'
const fs = require("fs");
const f = "app/admin/works/[id]/page.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  `placeholder:"Текст произведения...\n\nРазделяйте строфы двойным переносом строки"`,
  `placeholder:"Текст произведения...\\n\\nРазделяйте строфы двойным переносом строки"`
);
fs.writeFileSync(f, c);
console.log("Fixed!");
'@ | Set-Content fix-string.js -Encoding UTF8