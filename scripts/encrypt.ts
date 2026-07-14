import { RawData } from "../src/rawData";
import { MajorPreferenceData } from "../src/majorData";
import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

function getPassword(): string {
  // 1. Try command line argument --password="xyz"
  const passwordArg = process.argv.find((arg) => arg.startsWith("--password="));
  if (passwordArg) {
    return passwordArg.split("=")[1];
  }

  // 2. Try environment variable
  if (process.env.DATA_ENCRYPT_PASSWORD) {
    return process.env.DATA_ENCRYPT_PASSWORD;
  }

  return "";
}

function main() {
  const password = getPassword();

  if (!password) {
    console.error("❌ Error: Password is required for encryption.");
    console.error("Please provide it via one of the following methods:");
    console.error("  1) Command-line: npm run encrypt -- --password=\"your_password\"");
    console.error("  2) Environment variable in .env.local: DATA_ENCRYPT_PASSWORD=\"your_password\"");
    process.exit(1);
  }

  console.log("🔒 Encrypting admission data with the provided password...");

  const combinedData = {
    RawData,
    MajorPreferenceData,
  };

  try {
    const rawJson = JSON.stringify(combinedData);
    const ciphertext = CryptoJS.AES.encrypt(rawJson, password).toString();

    const outputDir = path.resolve(process.cwd(), "src/assets");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "encryptedData.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ data: ciphertext }, null, 2),
      "utf-8"
    );

    console.log(`✅ Success: Encrypted data written to ${outputPath}`);
    console.log("⚠️  Make sure you add 'src/rawData.ts' and 'src/majorData.ts' to .gitignore so they are not committed to GitHub.");
  } catch (error) {
    console.error("❌ Encryption failed:", error);
    process.exit(1);
  }
}

main();
