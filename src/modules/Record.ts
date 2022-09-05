import { useSnakeStore } from "../store/snake";

class Record{
    snakeStore = useSnakeStore()
    upLevelNum: number;
    private scoreElem: HTMLElement;
    private levelElem: HTMLElement;  
    constructor(upLevelNum:number=10){
        this.scoreElem = document.getElementById("score") as HTMLElement;
        this.levelElem = document.getElementById("level") as HTMLElement;
        this.upLevelNum = upLevelNum
    }
    reset(){
        this.scoreElem.innerHTML = "score:" + this.snakeStore.score
        this.levelElem.innerHTML = "level:" + this.snakeStore.level
    }
    addScore(){
        this.snakeStore.score++
        this.scoreElem.innerHTML = "score:" + this.snakeStore.score
        if (this.snakeStore.score % this.upLevelNum == 0) {
            this.upLevel()
        }
    }
    upLevel(){
        if (this.snakeStore.level>=10) {
            return
        }
        this.snakeStore.level++
        this.levelElem.innerHTML = "level:" + this.snakeStore.level
    }
}

export default Record;