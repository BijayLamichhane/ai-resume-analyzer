# AI Resume Analyzer

AI Resume Analyzer is a modern, full-stack application designed to analyze resumes using Artificial Intelligence. Built with React Router v7, styled with Tailwind CSS v4, and powered by [Puter.js](https://puter.com/) for cloud infrastructure including user authentication, file storage, AI processing, and key-value datastores.

## Features

- 🚀 **Full-Stack React Application**: Built on top of React Router v7 utilizing its latest routing and data-loading capabilities.
- ⚡️ **AI-Powered Analysis**: Seamlessly uses `puter.js` as the AI backend to summarize, score, and evaluate uploaded resumes.
- 📁 **File Upload & PDF Support**: Allows users to upload PDF resumes using `react-dropzone`. Uses `pdfjs-dist` to process user-provided PDFs.
- 🔒 **User Authentication**: Secure and fast authentication handled seamlessly out of the box via Puter API.
- 🔄 **State Management**: Application state is managed centrally using clean and lightweight `zustand` stores.
- 🎨 **Modern Styling**: A clean, responsive, and aesthetically pleasing interface styled using Tailwind CSS v4 and `clsx` utilities.

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Install the dependencies:

```bash
npm install
```

2. Make sure the PDF.js worker is properly copied to the `public` directory:

```bash
npm run postinstall
```

### Development

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Serve the built application:

```bash
npm run start
```

## Project Structure

```text
├── package.json
├── public/                 # Static assets (including PDF.js worker)
└── app/
    ├── components/         # Reusable React components (UI elements)
    ├── lib/                # Core utilities (Puter integration, PDF-to-image conversion)
    ├── routes/             # App views/pages mapping to the routes
    ├── root.tsx            # Application Shell
    └── routes.ts           # React Router declarative routing configuration
```

## Troubleshooting

### PDF Conversion Issues

If you encounter "Failed to convert PDF to image" errors or issues when previewing resumes, verify the following:

1. **Check Browser Compatibility**: Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge).
2. **File Size**: Make sure your PDF file is under 20MB.
3. **File Format**: Verify the file is indeed a valid `.pdf`.
4. **Worker File Not Found**: The PDF.js worker (`pdf.worker.min.mjs`) must be in the `public/` directory. If it indicates an API version mismatch or cannot be found, run `npm run postinstall` to sync the worker file.
5. **Refresh Page**: Try refreshing the page if the PDF.js library fails to load immediately.
6. **Canvas Not Supported**: Some older browsers don't support HTML5 Canvas rendering.

_Note: If PDF conversion strictly fails, a placeholder fallback image will be created automatically to let the analysis continue without a preview._

---

Built using React Router & Puter.js
