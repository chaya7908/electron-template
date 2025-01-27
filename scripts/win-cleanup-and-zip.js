const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

const outputDir = path.join(__dirname, "../win_build_output");
const unpackedDir = path.join(outputDir, "win-unpacked");
const finalZip = path.join(__dirname, "../win.zip");

(async () => {
  try {
    const tempDir = path.join(outputDir, "temp");
    await fs.copy(unpackedDir, tempDir);

    console.log("Copied win-unpacked to temp directory.");

    // delete files
    const filesToDelete = [
      "LICENSE.electron.txt",
      "LICENSES.chromium.html",
      "chrome_100_percent.pak",
      "chrome_200_percent.pak",
      "d3dcompiler_47.dll",
      "libEGL.dll",
      "libGLESv2.dll",
      "locales",
      // resources
      // resources.pak
      "snapshot_blob.bin",
      // v8_context_snapshot.bin
      "vk_swiftshader.dll",
      "vk_swiftshader_icd.json",
      "vulkan-1.dll",
    ];

    for (const file of filesToDelete) {
      const filePath = path.join(tempDir, file);
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        console.log(`Deleted: ${file}`);
      }
    }

    // create zip
    const output = fs.createWriteStream(finalZip);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`ZIP file created at ${finalZip}. Size: ${archive.pointer()} bytes`);
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);

    const zipDirectoryName = "CS-Game";
    archive.directory(tempDir, zipDirectoryName);

    await archive.finalize();

    // delete temp directory
    await fs.remove(tempDir);
    console.log("Temporary directory removed.");
  } catch (err) {
    console.error("Error during cleanup and zip process:", err);
  }
})();
