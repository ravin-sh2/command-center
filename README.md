# Command Center

Command Center is a sleek personal productivity dashboard that brings small everyday tools into one focused workspace. It is designed as a polished front-end project: practical enough to use, visual enough to show, and compact enough to understand at a glance.

**Live demo:** https://ravin-sh2.github.io/command-center/

## What It Does

Command Center combines a set of useful tools inside a responsive dashboard interface:

- Calculator with recent calculation history
- Notes and task manager with local browser saving
- Focus timer with preset sessions
- Weather planner interface
- Scannable QR code generator
- Local password generator
- Map search launcher
- Music/focus mode launcher
- Small playable 2248-style puzzle board

## Design Goals

The project is built around a clean command-console feel rather than a typical landing page. The interface uses compact panels, strong spacing, practical controls, and a theme system so the app feels like an actual dashboard rather than a template.

The app includes three visual modes:

- **Command**: warm operational dashboard style
- **Light Desk**: brighter productivity workspace
- **Night Ops**: darker high-contrast mode

## Built With

- React
- Vite
- Framer Motion
- Lucide React
- QRCode
- CSS Grid and custom CSS variables

## Privacy Notes

Command Center runs fully in the browser. Notes, tasks, and calculator history are stored with `localStorage`. Generated passwords are created locally with the browser crypto API and are not sent to a server.

## Preview

The project is deployed with GitHub Pages:

```text
https://ravin-sh2.github.io/command-center/
```

## Run Locally

```bash
git clone https://github.com/ravin-sh2/command-center.git
cd command-center
npm install
npm run dev
```

## Author

Built by **Ravin Shalmashi**.
