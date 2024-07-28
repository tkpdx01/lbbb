const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'docs/web');
const fileName = process.argv[2];

if (!fileName) {
  console.error('请提供文件名');
  process.exit(1);
}

const filePath = path.join(directoryPath, `${fileName}.md`);
const date = new Date().toISOString().split('T')[0]; // 使用当前日期

const frontMatter = `---
slug: ${fileName}
title: ${fileName.replace(/-/g, ' ')}
date: ${date}
authors: kuizuo
tags: [javascript, hook]
keywords: [javascript, hook]
---

<!-- truncate -->
`;

fs.writeFileSync(filePath, frontMatter);
console.log(`文件已创建: ${filePath}`);
