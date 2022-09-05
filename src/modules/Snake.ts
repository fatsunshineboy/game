import { useSnakeStore } from "../store/snake";
class Snake {
  private snake: HTMLElement = document.getElementById("snake") as HTMLElement;
  private head: HTMLElement = this.snake.children[0] as HTMLElement;
  bodies: HTMLCollection = document.getElementsByClassName("body");
  bodiesParent: HTMLElement = document.getElementById("bodies") as HTMLElement;
  snakeGameHead = document.getElementById("head");
  snakeStore = useSnakeStore();

  // 动态获取图片路径
  getImageUrl(name: string) {
    return new URL(`../assets/image/snake/${name}.png`, import.meta.url).href;
  }

  get x() {
    return this.head.offsetLeft;
  }
  get y() {
    return this.head.offsetTop;
  }

  reset() {
    this.head.style.left = 0 + "px"
    this.head.style.top = 0 + "px"
    for (let i = this.bodiesParent.childNodes.length - 1; i >= 0; i--) {
      const element = this.bodiesParent.childNodes[i];
      this.bodiesParent.removeChild(element);
    }
  }

  set x(value) {
    if (this.x == value) {
      return;
    }
    if (value < 0 || value >= 370) {
      this.snakeStore.isTouchWall = true
      return
    }
    if (this.bodies.length >= 2 && (this.bodies[1] as HTMLElement).offsetLeft == value) {
      //向左掉头
      if (value < this.x) {
        this.snakeStore.direction = "Right";      
        value += 20
      }
      //向右掉头
      else if (value > this.x) {
        this.snakeStore.direction = "Left";        
        value -= 20
      }
    }
    else{
      if (value > this.x) {
        
        (this.snakeGameHead as any).style.backgroundImage = `url(${this.getImageUrl('right')})`;
      }
      else{
        (this.snakeGameHead as any).style.backgroundImage = `url(${this.getImageUrl('left')})`;
      }
    }
    this.moveBody();
    this.head.style.left = value + "px";
    if (this.touchBody()) {
      this.snakeStore.isEatSelf = true
    }
  }
  set y(value) {
    if (this.y == value) {
      return;
    }
    if (value < 0 || value >= 410) {
      this.snakeStore.isTouchWall = true
      return
    }
    if (this.bodies.length >= 2 && (this.bodies[1] as HTMLElement).offsetTop == value) {
      //向上掉头
      if (value < this.y) {
        console.log("向上掉头");
        this.snakeStore.direction = "Down";
        value += 20
      }
      //向下掉头
      else if (value > this.y) {
        console.log("向下掉头");
        this.snakeStore.direction = "Up";
        value -= 20
      }
    }
    else{
      if (value > this.y) {
        
        (this.snakeGameHead as any).style.backgroundImage =`url(${this.getImageUrl('down')})`;
      }
      else{
        (this.snakeGameHead as any).style.backgroundImage =`url(${this.getImageUrl('up')})`;
      }
    }
    this.moveBody();
    this.head.style.top = value + "px";
    if (this.touchBody()) {
      this.snakeStore.isEatSelf = true
    }
  }
  moveBody() {
    if (this.bodies.length >= 2) {
      for (let i = this.bodies.length - 1; i > 0; i--) {
        let X = (this.bodies[i - 1] as HTMLElement).offsetLeft;
        let Y = (this.bodies[i - 1] as HTMLElement).offsetTop;
        (this.bodies[i] as HTMLElement).style.left = X + "px";
        (this.bodies[i] as HTMLElement).style.top = Y + "px";
      }
    }
  }
  // 判断有没有撞到身体
  touchBody() {
    for (let i = this.bodies.length - 1; i > 0; i--) {
      let X = (this.bodies[i] as HTMLElement).offsetLeft;
      let Y = (this.bodies[i] as HTMLElement).offsetTop;
      if (this.x == X && this.y == Y) {
        return true
      }
    }
  }
  //增加身体
  addBody() {
    this.bodiesParent.insertAdjacentHTML("beforeend", '<div class="body"></div>');
  }
  
}

export default Snake;
