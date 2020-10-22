const fs = require('fs');
const path = require('path');
const pkgPath = path.resolve(process.cwd(), './package.json');
const jsConfPath = path.resolve(process.cwd(), './jsconfig.json');

const config = `
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`;

if (!fs.existsSync(pkgPath)) {
  console.log('package.json 不存在，请在项目根目录中运行');
} else {
  fs.writeFileSync(jsConfPath, config.trim());
}
