#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Proje src klasörü
const SRC_DIR = path.join(__dirname, "src");

// Tüm .ts ve .tsx dosyalarını bul
function getAllTSFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTSFiles(filePath));
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      results.push(filePath);
    }
  });
  return results;
}

// Her dosyada import ve getPrisma() düzelt
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Import satırını düzelt
  content = content.replace(
    /import\s*{\s*getPrisma\s*}\s*from\s*['"]@\/lib\/prisma['"]/g,
    `import { prisma } from "@/lib/prisma"`
  );

  // const prisma = getPrisma() satırını kaldır
  content = content.replace(/const\s+prisma\s*=\s*getPrisma\(\);?/g, "");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
  }
}

// Çalıştır
const files = getAllTSFiles(SRC_DIR);
files.forEach(fixFile);

console.log("🎉 All Prisma imports fixed! Use 'prisma' now.");