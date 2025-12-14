# Maze Game

A progressive maze exploration RPG built with React and TypeScript. Navigate through procedurally-rendered labyrinths, defeat enemies, collect items, and solve puzzles to reach the exit.

## Overview

This application is a browser-based maze game that combines exploration mechanics with RPG elements. Players reveal tiles progressively, manage an inventory system, engage in turn-based combat, and solve key-door puzzles across multiple levels.

## Features

- Progressive tile revelation mechanics
- Turn-based combat system with weapons and enemies
- Inventory management with keys, weapons, and items
- Dynamic sprite-based tileset rendering using bitmask algorithm
- Multiple levels with increasing difficulty
- Score tracking and leaderboard system
- Responsive grid scaling for various screen sizes

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm (included with Node.js)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Buen0-Wh1te/Maze.git
cd Maze
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Build

Create a production build:

```bash
npm run build
```

The optimized build will be output to the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components (Tile, Inventory, BattleModal, etc.)
├── pages/           # Page components (Home, Game, Score, Victory)
├── hooks/           # Custom React hooks (useGame, useInventory, useCombat, etc.)
├── utils/           # Utility functions (tileset calculations, tile interactions)
├── types/           # TypeScript type definitions
├── constants/       # Configuration constants
├── services/        # API service layer
└── assets/          # Static assets (sprites, tilesets, backgrounds)
```

## How It Works

### Tile Rendering System

The game uses a sophisticated tileset rendering system based on bitmask pattern matching. Each tile analyzes its eight neighbors (cardinal and diagonal directions) to determine the appropriate sprite from the tileset:

1. Calculate an 8-bit bitmask representing neighboring tiles of the same type
2. Match the bitmask against a pre-computed bitmap reference
3. Use weighted Hamming distance to find the closest sprite if no exact match exists
4. Apply sprite coordinates to render the tile with pixel-perfect alignment

### Game State Management

Game state is managed through custom React hooks:

- `useGameState`: Manages level data, tile states, and player position
- `useInventory`: Handles key collection, weapon management, and item storage
- `useCombat`: Controls battle logic and enemy encounters
- `usePlayerMovement`: Manages movement animations and transitions

### Tile Interaction Flow

1. Player clicks or uses arrow keys to move to an adjacent revealed tile
2. The tile is revealed and its content is evaluated
3. Interaction handler determines the action (collect item, start battle, open door, etc.)
4. Game state is updated accordingly
5. Victory condition is checked after each move

### API Integration

The game communicates with a backend API to retrieve level configurations:

- Level grid data with tile types and positions
- Enemy definitions with stats and descriptions
- Item catalog with properties and effects
- Score submission and leaderboard retrieval

## Game Mechanics

### Tile Types

- `S`: Start position (automatically revealed)
- `E`: Exit (victory condition)
- `C`: Path (walkable corridor)
- `W`: Wall (impassable obstacle)
- `M`: Monster (initiates combat)
- `K`: Key (collectible, used to open doors)
- `D`: Door (requires matching key color)
- `A`: Armor/Weapon (combat advantage)
- `I`: Item (miscellaneous collectibles)
- `O`: Objective (special collectibles)

### Movement Rules

- Only tiles adjacent to already revealed tiles can be revealed
- Only tiles adjacent to the player can be accessed
- Walls and locked doors block movement
- Monster tiles require combat resolution before passage

### Combat System

- Battles are turn-based with automatic resolution
- Player victory requires a weapon in inventory
- Defeat results in game over
- Successful combat clears the monster tile

### Scoring System

Score is calculated based on:
- Number of moves taken (lower is better)
- Tiles revealed (exploration bonus)
- Time elapsed
- Combat encounters

## Configuration

Game constants can be modified in `src/constants/config.ts`:

- `TILE_SIZE`: Base pixel size for each tile
- `TILE_GAP`: Spacing between tiles in the tileset
- `TILE_BORDER`: Border offset in the tileset image
- Bitmask weights for sprite matching algorithm

## Technology Stack

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- TailwindCSS 4.1.17
- React Router 7.10.1
- Framer Motion 12.23.25

## License

This project is part of an academic assignment.

## Authors

Developed as part of a frontend development course.
