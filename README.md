# 3MF Viewer

A lightweight React application for viewing and sharing 3MF files for 3D printing. Built with React, Three.js, and Tailwind CSS.

## Features

- View 3MF files in 3D with pan, zoom, and rotate controls
- Simple UI for selecting different models
- Download functionality for 3MF files
- Responsive design
- Modern UI with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your 3MF files:
- Place your 3MF files in the `public/models` directory
- Update the `AVAILABLE_MODELS` array in `src/App.jsx` with your model information

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

- Use the model selector in the top-left corner to switch between different 3MF models
- Control the 3D view:
  - Left click + drag to rotate
  - Right click + drag to pan
  - Scroll to zoom
- Click the download button (⬇️) next to a model name to download the 3MF file

## Technologies Used

- React
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
