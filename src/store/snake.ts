import { defineStore } from "pinia";
// 第一个参数是应用程序中 store 的唯一 id
export const useSnakeStore = defineStore("snake", {
  state: () => ({
    score:0,
    level:1,
    isStart : false,
    isEatSelf : false,
    isTouchWall: false,
    isPause: false,
    direction:"",
  }),
  actions: {
    reset(){
      this.score = 0;
      this.level = 1;
      this.isStart = false;
      this.isEatSelf = false;
      this.isTouchWall= false;
      this.isPause= false;
      this.direction="";
    }
  },
});
