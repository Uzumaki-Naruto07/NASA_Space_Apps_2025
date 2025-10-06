# NASA TEMPO Gaming Experience

This directory contains three immersive gaming experiences that teach air quality management through interactive gameplay.

## Games Overview

### 1. AQI Management Lab (`AQIManagementGame.tsx`)
- **Purpose**: Strategic city-wide air quality management
- **Features**: 
  - 3D city visualization with real-time pollution effects
  - Policy deployment system with budget management
  - TEMPO satellite scanning integration
  - Weather events and district-specific pollution levels
- **Learning Objectives**: Understanding AQI, policy impact, and urban air quality management

### 2. PFAS Research Lab (`PFASLabGame.tsx`)
- **Purpose**: Analytical chemistry for forever chemical identification
- **Features**:
  - 3D laboratory environment with LC-MS/MS equipment
  - Chemical analysis workflows (Conventional vs TOP Assay)
  - Solution deployment for contamination remediation
  - Real-time exposure level monitoring
- **Learning Objectives**: PFAS chemistry, analytical methods, and environmental remediation

### 3. Clean Air Field Ops (`FieldOpsGame.tsx`)
- **Purpose**: Field operations in hazardous environments
- **Features**:
  - 3D first-person navigation with WASD controls
  - Mission objectives with time pressure
  - Hazard zone avoidance mechanics
  - TEMPO scanner integration for emission detection
- **Learning Objectives**: Field safety, mission planning, and real-time environmental monitoring

## Technical Implementation

### Dependencies
- **React**: Component state management and lifecycle
- **Three.js**: 3D graphics rendering and scene management
- **Lucide React**: Icon components for UI elements
- **Framer Motion**: Animation and transitions (in main GamePage)

### Key Features
- **3D Graphics**: Each game uses Three.js for immersive 3D environments
- **Real-time Updates**: Game state updates every few seconds with dynamic effects
- **Interactive Controls**: Mouse/keyboard input for navigation and actions
- **Progressive Difficulty**: Games become more challenging over time
- **Educational Content**: Scientific accuracy in pollution modeling and chemical analysis

### Game States
Each game follows a consistent state pattern:
- `menu`: Initial game selection screen
- `playing`: Active gameplay state
- `won`: Victory condition achieved
- `lost`: Game over conditions

### Integration
Games are integrated into the main `GamePage.tsx` through a floor selection system that allows users to choose their mission type and seamlessly transition between different gaming experiences.

## Usage

The games are accessible through the main GamePage at `/game` route. Users can:
1. Select a floor/mission type from the main menu
2. Play through the interactive 3D experience
3. Learn about air quality management through gameplay
4. Return to the main menu to try different missions

## Educational Value

Each game teaches specific aspects of air quality management:
- **AQI Management**: Policy impact, budget constraints, and urban planning
- **PFAS Research**: Chemical analysis, laboratory procedures, and contamination remediation
- **Field Ops**: Safety protocols, mission execution, and environmental monitoring

The games combine entertainment with education, making complex environmental science concepts accessible through interactive gameplay.
