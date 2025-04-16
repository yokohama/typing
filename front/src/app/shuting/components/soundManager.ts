import { Howl, Howler } from 'howler';

export class SoundManager {
  private bgm: Howl;
  private successSound: Howl;
  private correctSound: Howl;
  private incorrectSound: Howl;
  private finishSound: Howl;
  private perfectSound: Howl;
  private readyGoSound: Howl;
  private selectSound: Howl;

  constructor() {
    const bgmList = [
      '/sounds/bgms/Morning.mp3',
      '/sounds/bgms/BGM_-_067_-_Stone_Dance.mp3',
      '/sounds/bgms/Dive_To_Mod.mp3',
      '/sounds/bgms/bgm.mp3',
      '/sounds/bgms/kaeruno_piano.mp3',
    ];
    const randomIndex = Math.floor(Math.random() * bgmList.length);

    this.bgm = new Howl({
      src: [bgmList[randomIndex]],
      loop: true,
      volume: 0.5,
    });

    this.successSound = new Howl({ src: ['/sounds/success2.mp3'], volume: 1.0 });
    this.perfectSound = new Howl({ src: ['/sounds/excellent.mp3'], volume: 1.0 });
    this.correctSound = new Howl({ src: ['/sounds/good.mp3'], volume: 1.0 });
    this.incorrectSound = new Howl({ src: ['/sounds/out.mp3'], volume: 1.0 });
    this.finishSound = new Howl({ src: ['/sounds/finish.mp3'], volume: 0.5 });
    this.readyGoSound = new Howl({ src: ['/sounds/readygo.mp3'], volume: 1.0 });
    this.selectSound = new Howl({ src: ['/sounds/correct.mp3'], volume: 1.0 });
  }

  playBgm() {
    if (!this.bgm.playing()) {
      this.bgm.play();
    }
  }

  stopBgm() {
    this.bgm.stop();
  }

  playSuccess() {
    this.successSound.stop();
    this.successSound.play();
  }

  playCorrect() {
    this.correctSound.stop();
    this.correctSound.play();
  }

  playIncorrect() {
    this.incorrectSound.stop();
    this.incorrectSound.play();
  }

  playFinish() {
    this.finishSound.stop();
    this.finishSound.play();
  }

  playPerfect() {
    this.perfectSound.stop();
    this.perfectSound.play();
  }

  playReadyGo() {
    this.readyGoSound.stop();
    this.readyGoSound.play();
  }

  playSelect() {
    this.selectSound.stop();
    this.selectSound.play();
  }

  setVolume(volume: number) {
    Howler.volume(volume);
  }
}
