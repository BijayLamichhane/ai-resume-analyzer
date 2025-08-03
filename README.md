# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

## Troubleshooting

### PDF Conversion Issues

If you encounter "Failed to convert PDF to image" errors, try the following:

1. **Check Browser Compatibility**: Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
2. **File Size**: Make sure your PDF file is under 20MB
3. **File Format**: Ensure the file is a valid PDF
4. **Refresh Page**: Try refreshing the page if the PDF.js library fails to load
5. **Check Console**: Open browser developer tools (F12) and check for any error messages in the Console tab

### Common Issues

- **Worker File Not Found**: The PDF.js worker file should be in the `public/` directory
- **Version Mismatch**: If you see "API version does not match Worker version" error, run `npm run postinstall` to sync the worker file
- **Canvas Not Supported**: Some older browsers don't support HTML5 Canvas
- **Memory Issues**: Large PDF files may cause memory issues in some browsers

### Debug Information

The application now includes enhanced error reporting and fallback mechanisms. If PDF conversion fails, a placeholder image will be created to allow the analysis to continue.

---

Built with ❤️ using React Router.
