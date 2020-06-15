import {Howl, Howler} from 'howler';

export class Sound {
    jumpSoundFile: string;
    platformSoundFile: string;
    moveSoundFile: string;
    winSoundFile: string;
    hitWallSoundFile: string
    passPhaseSoundFile: string;

    audioVolumeThreshold = 90;

    constructor() {
        this.jumpSoundFile      = 'sound/jump.mp3';
        this.platformSoundFile  = 'sound/paltform.mp3';
        this.moveSoundFile      = 'sound/move_state.mp3';
        this.winSoundFile       = 'sound/you_win.mp3';
        this.hitWallSoundFile   = 'sound/hit_wall.mp3';
        this.passPhaseSoundFile = 'sound/pass_phase.mp3';
    }

    playJumpSound(){
        let sound  =  new Howl({
            src: [this.jumpSoundFile],
            volume: 0.2
        });
        sound.play();
    }

    playPlatformSound(){
        let sound = new Howl({
            src: [this.platformSoundFile],
            volume: 0.1
        });
        sound.play();
    }

    playMoveSound(){
        let sound = new Howl({
            src: [this.moveSoundFile],
            volume: 0.05
        });
        sound.play();
    }

    playPassPhase() {
        let sound = new Howl({
            src: [this.passPhaseSoundFile],
            volume: 0.1
        });
        sound.play();
    }

    playWin() {
        let sound = new Howl({
            src: [this.winSoundFile],
            volume: 0.1
        });
        sound.play();
    }

    playHitWall(){
        let sound = new Howl({
            src: [this.hitWallSoundFile],
            volume: 0.1
        });
        sound.play();
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

                    console.log(Math.round(volume));
                    if (sound.audioVolumeThreshold <= volume) {
                        onAudioPeak()
                    }
                }
            });
    }

}