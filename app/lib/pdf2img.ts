export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

function checkBrowserCompatibility(): { supported: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for canvas support
  if (!document.createElement("canvas").getContext) {
    issues.push("Canvas 2D context not supported");
  }

  // Check for File API support
  if (!window.File || !window.FileReader) {
    issues.push("File API not supported");
  }

  // Check for Blob support
  if (!window.Blob) {
    issues.push("Blob API not supported");
  }

  // Check for URL.createObjectURL support
  if (!window.URL || !window.URL.createObjectURL) {
    issues.push("URL.createObjectURL not supported");
  }

  return {
    supported: issues.length === 0,
    issues,
  };
}

async function testWorkerFile(): Promise<boolean> {
  try {
    const workerUrl = new URL("/pdf.worker.min.mjs", window.location.origin)
      .href;
    const response = await fetch(workerUrl, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Worker file test failed:", error);
    return false;
  }
}

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;

  try {
    // Test if worker file is accessible
    const workerAccessible = await testWorkerFile();
    if (!workerAccessible) {
      throw new Error(
        "PDF.js worker file is not accessible. Please check if the file exists in the public directory."
      );
    }

    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
      // Set the worker source to use local file with absolute URL
      const workerUrl = new URL("/pdf.worker.min.mjs", window.location.origin)
        .href;
      lib.GlobalWorkerOptions.workerSrc = workerUrl;
      pdfjsLib = lib;
      isLoading = false;
      return lib;
    });

    return loadPromise;
  } catch (error) {
    console.error("Failed to load PDF.js library:", error);
    isLoading = false;
    throw new Error(`Failed to load PDF.js library: ${error}`);
  }
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    console.log(
      "Starting PDF conversion for file:",
      file.name,
      "Size:",
      file.size
    );

    // Check browser compatibility
    const compatibility = checkBrowserCompatibility();
    if (!compatibility.supported) {
      throw new Error(
        `Browser compatibility issues: ${compatibility.issues.join(", ")}`
      );
    }

    // Validate file
    if (!file || file.size === 0) {
      throw new Error("Invalid file: file is null or empty");
    }

    if (!file.type.includes("pdf")) {
      throw new Error("Invalid file type: expected PDF file");
    }

    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 }); // Reduced scale for better performance

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas 2D context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            const imageUrl = URL.createObjectURL(blob);

            resolve({
              imageUrl,
              file: imageFile,
            });
          } else {
            console.error("Failed to create image blob");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob from canvas",
            });
          }
        },
        "image/png",
        0.9 // Slightly reduced quality for better performance
      );
    });
  } catch (err) {
    console.error("PDF conversion error:", err);

    // Provide more specific error messages
    let errorMessage = "Failed to convert PDF to image";

    if (err instanceof Error) {
      if (err.message.includes("Failed to load PDF.js library")) {
        errorMessage =
          "PDF processing library failed to load. Please refresh the page and try again.";
      } else if (err.message.includes("Invalid file")) {
        errorMessage = err.message;
      } else if (err.message.includes("Failed to get canvas")) {
        errorMessage =
          "Browser does not support canvas rendering. Please try a different browser.";
      } else {
        errorMessage = `PDF conversion failed: ${err.message}`;
      }
    }

    // Create a fallback placeholder image
    try {
      console.log("Creating fallback placeholder image...");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = 800;
        canvas.height = 600;

        // Create a simple placeholder
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#6b7280";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "PDF Preview Unavailable",
          canvas.width / 2,
          canvas.height / 2 - 20
        );

        ctx.font = "16px Arial";
        ctx.fillText(
          "Resume analysis will continue without preview",
          canvas.width / 2,
          canvas.height / 2 + 20
        );

        return new Promise<PdfConversionResult>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const originalName = file.name.replace(/\.pdf$/i, "");
              const imageFile = new File(
                [blob],
                `${originalName}_placeholder.png`,
                {
                  type: "image/png",
                }
              );

              const imageUrl = URL.createObjectURL(blob);

              console.log("Fallback image created successfully");
              resolve({
                imageUrl,
                file: imageFile,
                error: errorMessage, // Still include the original error for debugging
              });
            } else {
              resolve({
                imageUrl: "",
                file: null,
                error: errorMessage,
              });
            }
          }, "image/png");
        });
      }
    } catch (fallbackError) {
      console.error("Failed to create fallback image:", fallbackError);
    }

    return {
      imageUrl: "",
      file: null,
      error: errorMessage,
    };
  }
}
