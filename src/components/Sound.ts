import {Howl, Howler} from 'howler';

export class Sound {
    platformSound: Howl;
    moveSound: Howl;
    winSound: Howl;
    hitWallSound: Howl;
    passPhaseSound: Howl;
    loseSound: Howl;
    jumpSound: Howl;
    generalMusic: Howl;
    menuMusic: Howl;

    audioVolumeThreshold = 90;
    pause = false;

    constructor() {
        this.jumpSound =    new Howl({
            src: ['sound/jump.mp3'],
            volume: 0.2
        });
        this.platformSound  = new Howl({
            src: ['sound/paltform.mp3'],
            volume: 0.1
        });
        this.moveSound = new Howl({
            src: ['sound/move_state.mp3'],
            volume: 0.05
        });
        this.winSound = new Howl({
            src: ['sound/you_win.mp3'],
            volume: 0.1
        });
        this.hitWallSound   =  new Howl({
            src: ['sound/hit_wall.mp3'],
            volume: 0.1
        });
        this.passPhaseSound = new Howl({
            src: ['sound/pass_phase.mp3'],
            volume: 0.1
        });
        this.loseSound = new Howl({
            src: ['sound/lose.mp3'],
            volume: 0.2
        });
        this.generalMusic = new Howl({
            src: ['sound/general.mp3'],
            volume: 0.15,
            loop: true
        });
        this.menuMusic = new Howl({
            src: ['sound/menu.mp3'],
            volume: 0.15,
            loop: true
        });
    }

    playJumpSound(){
        this.jumpSound.play();
    }

    playGameMusic(){
        if(!this.generalMusic.playing() && !this.pause) {
            this.generalMusic.play();
        }
    }

    playMenuMusic(){
        if(!this.menuMusic.playing()) {
            this.menuMusic.play();
        }
    }

    stopMenuMusic(){
        this.menuMusic.stop();
    }

    stopGameMusic(){
        this.generalMusic.stop();
    }

    pauseGameMusic(){
        this.pause = true;
        if(this.pause) this.generalMusic.pause();
    }

    restartMusic(){
        this.pause = false;
    }

    stopLoseMusic(){
        this.loseSound.stop();
    }

    playLoseSound(){
        this.loseSound.play();
    }

    playPlatformSound(){
        this.platformSound.play();
    }

    playMoveSound(){
        this.moveSound.play();
    }

    playPassPhase() {
        this.passPhaseSound.play();
    }

    playWin() {
        this.winSound.play();
    }

    playHitWall(){
        this.hitWallSound.play();
    }

    changeGlobalVolume(vol:number){
        Howler.volume(vol);
    }

    setupMicrophoneListener(onAudioPeak: () => void) {
        let sound = this
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then( (stream) => {
                let audioContext = new window.AudioContext();
                let analyser = audioContext.createAnalyser();
                let microphone = audioContext.createMediaStreamSource(stream);
                let processor = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;
                
                microphone.connect(analyser);
                processor.connect(audioContext.destination);
                analyser.connect(processor);

                processor.onaudioprocess = function() {
                    var array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    var values = 0;

                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        values += (array[i]);
                    }

                    var volume = values / length;
                    
                    if (sound.audioVolumeThreshold <= volume) {
                        onAudioPeak()
                    }
                }
            });
    }

}