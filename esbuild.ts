import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import * as esbuild from "esbuild";
import { formatMetadata } from "./esbuild.plugin/metadata";
import type { DefaultImport } from "./esbuild.plugin/utils";

async function transformFiles() {
  const DEFAULT_GROUPS = ["059712504573", "313942877558"];
  const accountIds =
    process.env.ACCOUNT_IDS ?
      process.env.ACCOUNT_IDS.split(",")
        .filter((id) => id && !isNaN(Number(id)))
        .map((id) => id.trim())
    : DEFAULT_GROUPS;
  const srcDir = "./src";
  const buildDir = "./build";

  // Get a list of files in the source directory
  const files = await readdir(srcDir);
  const builders = [];

  // Iterate through each file
  for (const file of files) {
    const metaBuilders = [];
    if (file.endsWith(".meta.ts")) {
      const inputRawMetaTsPath = path.join(import.meta.dirname, srcDir, file);
      const outputMetaMjsPath = path.join(import.meta.dirname, buildDir, `${path.parse(file).name}.mjs`);
      const metaBuildTask = esbuild.build({
        entryPoints: [inputRawMetaTsPath],
        outfile: outputMetaMjsPath,
        bundle: true,
        allowOverwrite: true,
        minify: false,
        format: "esm",
        loader: {
          ".svg": "dataurl",
        },
        drop: ["debugger", "console"],
      });
      metaBuilders.push(metaBuildTask);
    }
    await Promise.all(metaBuilders);
    // Check if the file is a JavaScript file
    if (file.endsWith(".ts") && !file.includes(".meta")) {
      const inputPath = path.join(import.meta.dirname, srcDir, file);
      const outputUserJsPath = path.join(import.meta.dirname, buildDir, `${path.parse(file).name}.user.js`);
      const outputMetaJsPath = path.join(import.meta.dirname, buildDir, `${path.parse(file).name}.meta.js`);
      const prebuiltMjsPath = path.join(import.meta.dirname, buildDir, `${path.parse(file).name}.meta.mjs`);
      if (await stat(prebuiltMjsPath)) {
        const importedData: DefaultImport = (await import(prebuiltMjsPath)) as DefaultImport;
        const metadata = (await importedData)?.default;
        const banner = metadata ? formatMetadata(metadata) : "";
        // Use esbuild to transform and minify the JavaScript file
        const buildTask = esbuild.build({
          entryPoints: [inputPath],
          outfile: outputUserJsPath,
          bundle: true,
          allowOverwrite: true,
          minify: true, // Enable minification
          format: "iife",
          drop: ["debugger", "console"],
          banner: { js: banner }, // Add banner
          define: {
            ACCOUNT_IDS_REPLACE: JSON.stringify([...accountIds]), // Replace with your actual account IDs
          },
        });
        const buildMetaTask = writeFile(outputMetaJsPath, banner);
        console.log(`Transforming and minifying ${inputPath} to ${outputUserJsPath} and ${outputMetaJsPath}...}`);
        builders.push(buildTask);
        builders.push(buildMetaTask);
      }
    }
  }
  await Promise.all(builders);
}

await transformFiles();
