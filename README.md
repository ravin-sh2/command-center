# Command Center

A polished personal productivity dashboard built with React and Vite. Command Center brings everyday utilities into one focused interface: notes, tasks, calculations, timers, quick links, password generation, map search, music launchers, and a small 2248-style puzzle board.

Live demo: https://ravin-sh2.github.io/command-center/

## Highlights

- Clean responsive command-dashboard interface
- Theme switcher with Command, Light Desk, and Night Ops modes
- Calculator with recent calculation history
- Notes and tasks saved locally in the browser
- Focus timer with preset sessions
- Weather planner mock tool for planning around conditions
- Scannable QR code generator with editable payload text
- Local password generator using the browser crypto API
- Map search launcher for Google Maps, OpenStreetMap, and Bing Maps
- Music mode launcher for focus playlists
- Small playable 2248-style merge board

## Tech Stack

- React 19
- Vite 8
- Framer Motion
- Lucide React icons
- CSS custom properties and responsive CSS grid
- GitHub Pages deployment with GitHub Actions

## Getting Started

Clone the repository:

```bash
git clone https://github.com/ravin-sh2/command-center.git
cd command-center
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Check code quality:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is configured for GitHub Pages with:

```js
base: "/command-center/"
```

The deployment workflow lives in:

```text
.github/workflows/deploy.yml
```

To publish it:

1. Push the project to the `main` branch.
2. Open the repository on GitHub.
3. Go to **Settings > Pages**.
4. Set **Source** to **GitHub Actions**.
5. Run the deploy workflow or push a new commit.

The deployed site will be available at:

```text
https://ravin-sh2.github.io/command-center/
```

## Project Structure

```text
command-center/
|-- public/
|-- src/
|   |-- assets/
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- .github/workflows/deploy.yml
|-- index.html
|-- package.json
`-- vite.config.js
```

## Notes

- Notes, tasks, and calculator history are stored in `localStorage`.
- Passwords are generated locally in the browser and are not sent anywhere.
- The QR tool uses the `qrcode` package to generate standards-compliant scannable QR codes.

## Author

Built by Ravin Shalmashi.
