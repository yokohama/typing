export class SoundManager {
  private bgm: HTMLAudioElement;
  private successSound: HTMLAudioElement;
  private correctSound: HTMLAudioElement;
  private incorrectSound: HTMLAudioElement;
  private finishSound: HTMLAudioElement;
  private perfectSound: HTMLAudioElement;
  private readyGoSound: HTMLAudioElement;
  private selectSound: HTMLAudioElement;

  constructor() {
    const bgmList = [
      '/sounds/bgms/Morning.mp3',
      '/sounds/bgms/BGM_-_067_-_Stone_Dance.mp3',
      '/sounds/bgms/Dive_To_Mod.mp3',
      '/sounds/bgms/bgm.mp3',
      '/sounds/bgms/kaeruno_piano.mp3'
    ];
    const randomIndex = Math.floor(Math.random() * bgmList.length);

    this.bgm = new Audio(bgmList[randomIndex]);
    this.bgm.loop = true;

    this.successSound = new Audio('/sounds/success2.mp3');
    this.perfectSound = new Audio('/sounds/excellent.mp3');
    this.correctSound = new Audio('/sounds/good.mp3');
    this.incorrectSound = new Audio('/sounds/out.mp3');
    this.finishSound = new Audio('/sounds/finish.mp3');
    this.readyGoSound = new Audio('/sounds/readygo.mp3');
    this.selectSound = new Audio('/sounds/correct.mp3');
  }

  playBgm() {
    this.bgm.play().catch(error => console.error('Failed to play BGM:', error));
  }

  stopBgm() {
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  playSuccess() {
    this.successSound.currentTime = 0;
    this.successSound.play().catch(error => console.error('Failed to play success sound:', error));
  }

  playCorrect() {
    this.correctSound.currentTime = 0;
    this.correctSound.play().catch(error => console.error('Failed to play correct sound:', error));
  }

  playIncorrect() {
    this.incorrectSound.currentTime = 0;
    this.incorrectSound.play().catch(error => console.error('Failed to play incorrect sound:', error));
  }

  playFinish() {
    this.finishSound.currentTime = 0;
    this.finishSound.play().catch(error => console.error('Failed to play finish sound:', error));
  }

  playPerfect() {
    this.perfectSound.currentTime = 0;
    this.perfectSound.play().catch(error => console.error('Failed to perfect sound:', error));
  }

  playReadyGo() {
    this.readyGoSound.currentTime = 0;
    this.readyGoSound.play().catch(error => console.error('Failed to readygo sound:', error));
  }

  playSelect() {
    this.selectSound.currentTime = 0;
    this.selectSound.play().catch(error => console.error('Failed to select sound:', error));
  }
}
