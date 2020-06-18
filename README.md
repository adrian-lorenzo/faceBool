# FACE BOOL 🏀 

## Authors

- [AdrianLorenzoDev](https://github.com/AdrianLorenzoDev)
- [BorjaZarco](https://github.com/BorjaZarco)
- [miguel-kjh](https://github.com/miguel-kjh)
- [kevinrosalesdev](https://github.com/kevinrosalesdev)

## Summary

This is a class project of the [ULPGC](https://www.ulpgc.es/) for the subject *Creating User Interfaces*, which consists of the design of a prototype of multimodal interaction based on the detection of the presence of people. In our case, we have taken advantage of artificial intelligence face detection and microphone sound detection to create a platform game.

This videogame proposes a series of levels divided by stages, in which the user will have to move the ball making it advance from stage to stage, using a new platform created from the position and the inclination of his head, taking as main reference his eyes, nose and ears.

## Demo 🎮

<p align="center">
  <img src="media/demo.gif" alt="demo game">
</p>
<p align="center">
  Figure 1: Game demo
</p>

## How to Play?

All you need to play is:

* A webcam cam

* A microphone

The game is quite intuitive:

1. Stand in front of the camera.

2. When the model detects your face a platform will be created in front of you, this platform will move as you move your head either in position or at an angle.

3. Use the platform to catch the ball or push it.

4. With the microphone you can make the ball jump by shouting or blowing.

## Install

The first thing is to have **yarn** installed in your computer, it is the typescript package manager that we use, you can download it in the following [link](https://classic.yarnpkg.com/en/docs/install/#debian-stable).

Then you just need to clone this repository and install the dependencies.

```bash
    git clone https://github.com/AdrianLorenzoDev/ciuProject
    cd ciuProject
    yarn install
```

## Start Game🚀

To start the game, use the following commands to run the program via Electron.

```bash
    yarn build
    yarn electron-dev
```


## Dependencies

At work we use a lot of dependencies, among them are:

- [TypeScript](https://www.typescriptlang.org/)
- [Electron-js](https://www.electronjs.org/)
- [React-js](https://es.reactjs.org/)
- [Howler-js](https://howlerjs.com/)
- [Planck-js](https://piqnt.com/planck.js/)
- [p5-js](https://p5js.org/es/)
- [ngx-face-api-js](https://github.com/kamiazya/ngx-face-api-js)
