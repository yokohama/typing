export class SoundManager {
  private bgm: HTMLAudioElement;
  private successSound: HTMLAudioElement;
  private correctSound: HTMLAudioElement;
  private incorrectSound: HTMLAudioElement;
  private finishSound: HTMLAudioElement;

  constructor() {
    this.bgm = new Audio('/sounds/bgm.mp3');
    this.bgm.loop = true;

    this.successSound = new Audio('/sounds/success2.mp3');
    this.correctSound = new Audio('/sounds/correct.mp3');
    this.incorrectSound = new Audio('/sounds/incorrect.mp3');
    this.finishSound = new Audio('/sounds/finish.mp3');
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
}
