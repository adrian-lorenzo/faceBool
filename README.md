# FACE BOOL 🏀
The game that can be played with... the face?!?

## Authors

- [AdrianLorenzoDev](https://github.com/AdrianLorenzoDev)
- [BorjaZarco](https://github.com/BorjaZarco)
- [miguel-kjh](https://github.com/miguel-kjh)
- [kevinrosalesdev](https://github.com/kevinrosalesdev)

## What is this project about? 😮

This is the final project of the _Creating User Interfaces_ subject of the Computer Engineering degree at [ULPGC](https://www.ulpgc.es/), which consists of the implementation of a prototype that integrates multimodal interaction based on the detection of people presence.

In our case, we have taken advantage of artificial intelligence based face detection and microphone sound detection to create a platform game.

This videogame proposes a series of levels divided by stages, in which the user will have to move the ball making it move forward stage to stage, using a new platform created from the position and the inclination of his head, taking as main reference his eyes, nose and ears.

## Let me see a demo 🎮

<p align="center">
  <img src="media/demo.gif" alt="demo game">
</p>
<p align="center">
  Figure 1: Game demo
</p>

## How can I play? 👀

All you need to play is:

* A webcam 📷

* A microphone 🎤

The game is quite intuitive:

1. Stand in front of the camera.

2. When the model detects your face a platform will be created in front of you. This platform will move as you move your head either in position or at an angle.

3. Use the platform to catch the ball or push it.

4. If you want to make the ball jump, shout or blow at your microphone!

## I want to download and play it RIGHT NOW ⚡️

Great! You can download the last release of the game on the [releases page](https://github.com/AdrianLorenzoDev/faceBool/releases). There, you can download your preferred platform binaries 🙂

## Okay... and how about running the game on the development environment? 

All you need is to follow these steps:

### Clone and install dependencies

The first thing is to have **yarn** installed in your computer, it is the Javascript/Typescript package manager that we use, you can download it in the following [link](https://classic.yarnpkg.com/en/docs/install/#debian-stable).

Then you just need to clone this repository and install the dependencies:

```bash
    git clone https://github.com/AdrianLorenzoDev/faceBool.git
    cd ciuProject
    yarn install
```

### Start the game 🚀

To start the game, use the following command to run the program via Electron.

```bash
    yarn electron-dev
```

## Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [Electron](https://www.electronjs.org/)
- [React](https://es.reactjs.org/)
- [Howler.js](https://howlerjs.com/)
- [Planck.js](https://piqnt.com/planck.js/)
- [p5.js](https://p5js.org/es/)
