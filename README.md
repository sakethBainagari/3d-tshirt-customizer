# T-Shirt Customizer

An interactive 3D T-shirt customization web application built with Lit components and Three.js.

## Features

- 3D product visualization (T-shirt, Hoodie, Sleevie, Cap)
- Custom image upload with drag & drop support
- Text customization (up to 3 lines)
- Size customization (Height, Weight, Build)
- Three distinct themes (Dark, Light, Vibrant)
- Responsive design
- Storybook integration for component development

## Tech Stack

- Vanilla JavaScript with Lit components
- Three.js for 3D rendering
- Vite for development and building
- Storybook for component documentation
- Cloudflare Pages for deployment

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd t-shirt-customizer
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm start
```

4. View Storybook:
```bash
npm run storybook
```

## Development

The project uses:
- Lit components for UI elements
- Three.js for 3D model rendering
- Custom theme system (toggle with Alt+Q)
- Modular architecture for easy maintenance

## Building and Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Cloudflare Pages:
```bash
npm run deploy
```

## Project Structure

```
├── src/
│   ├── components/    # Lit components
│   ├── styles/        # CSS styles
│   └── app.js         # Main application logic
├── assets/           # Static assets
├── stories/          # Storybook stories
├── .storybook/       # Storybook configuration
└── public/           # Public static files
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details 