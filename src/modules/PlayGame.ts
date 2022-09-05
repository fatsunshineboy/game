import Record from "./Record";
import Food from "./Food";
import Snake from "./Snake";
import { useSnakeStore } from "../store/snake";
import upUrl from "../assets/image/1x/up.png";
import rightUrl from "../assets/image/1x/right.png";
import bottomUrl from "../assets/image/1x/bottom.png";
import leftUrl from "../assets/image/1x/left.png";
import toUpUrl from "../assets/image/1x/to_up.png";
import toRightUrl from "../assets/image/1x/to_right.png";
import toBottomUrl from "../assets/image/1x/to_bottom.png";
import toLeftUrl from "../assets/image/1x/to_left.png";

class PlayGame {
  record = new Record(5);
  food = new Food();
  snake = new Snake();
  snakeStore = useSnakeStore();
  snakeGameButtonTop = document.getElementById("gameButtonTop");
  snakeGameButtonRight = document.getElementById("gameButtonRight");
  snakeGameButtonLeft = document.getElementById("gameButtonLeft");
  snakeGameButtonBottom = document.getElementById("gameButtonBottom");
  timer: any;
  // isLive:Ref<boolean>

  // constructor(isLive:Ref<boolean>){
  //     this.isLive = isLive
  // }

  // 按钮改变方向
  initBackgroundImage() {
    (this.snakeGameButtonTop as any).src = upUrl;
    (this.snakeGameButtonRight as any).src = rightUrl;
    (this.snakeGameButtonLeft as any).src = leftUrl;
    (this.snakeGameButtonBottom as any).src = bottomUrl;
  }

  goUp() {
    if (this.snakeStore.isStart) {
      this.initBackgroundImage();
      (this.snakeGameButtonTop as any).src = toUpUrl;
      this.snakeStore.direction = "Up";
    }
  }

  goRight() {
    if (this.snakeStore.isStart) {
      this.initBackgroundImage();
      (this.snakeGameButtonRight as any).src = toRightUrl;
      this.snakeStore.direction = "Right";
    }
  }

  goLeft() {
    if (this.snakeStore.isStart) {
      this.initBackgroundImage();
      (this.snakeGameButtonLeft as any).src =toLeftUrl;
      this.snakeStore.direction = "Left";
    }
  }

  goDown() {
    if (this.snakeStore.isStart) {
      this.initBackgroundImage();
      (this.snakeGameButtonBottom as any).src =toBottomUrl;
      this.snakeStore.direction = "Down";
    }
  }

  //键盘改变方向
  changeDirection(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
      case "up":
        event.preventDefault();
        this.snakeStore.direction = "Up"
        this.goUp()
        break;
      case "ArrowDown":
      case "Down":
        event.preventDefault();
        this.snakeStore.direction = "Down"
        this.goDown()
        break;
      case "ArrowLeft":
      case "Left":
        event.preventDefault();
        this.snakeStore.direction = "Left"
        this.goLeft()
        break;
      case "ArrowRight":
      case "Right":
        event.preventDefault();
        this.snakeStore.direction = "Right"
        this.goRight()
        break;
      default:
        break;
    }
  }

  //蛇头的运动
  run() {
    if (
      this.snakeStore.isStart &&
      !this.snakeStore.isPause &&
      !this.snakeStore.isEatSelf &&
      !this.snakeStore.isTouchWall
    ) {
      let x = this.snake.x;
      let y = this.snake.y;
      switch (this.snakeStore.direction) {
        case "Up":
          y -= 10;
          break;
        case "Down":
          y += 10;
          break;
        case "Left":
          x -= 10;
          break;
        case "Right":
          x += 10;
          break;
        default:
          break;
      }
      if (!this.snakeStore.direction) {
        this.snakeStore.direction =
          Math.round(Math.random()) == 0 ? "Right" : "Down";
      }
      this.checkIsEated(x, y);
      this.snake.x = x;
      this.snake.y = y;
      this.timer = setTimeout(
        this.run.bind(this),
        300 - (this.snakeStore.level - 1) * 20
      );
    }
  }

  // 判断蛇是否吃到食物
  checkIsEated(x: number, y: number) {
    //吃到食物
    if (x == this.food.x && y == this.food.y) {
      this.record.addScore();
      this.food.generateNewFood(this.snake.bodies);
      this.snake.addBody();
    }
  }

  init() {
    //初始化
    this.timer && clearTimeout(this.timer);
    this.snakeStore.reset();
    this.food.reset();
    this.record.reset();
    this.snake.reset();
    this.initBackgroundImage();
  }

  playGame() {
    this.snakeStore.isStart = true;
    document.addEventListener("keydown", this.changeDirection.bind(this));
    this.food.generateNewFood(this.snake.bodies);
    this.run();
  }
}

export default PlayGame;
