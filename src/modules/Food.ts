class Food {
    private foodElem: HTMLElement = document.getElementById("foods") as HTMLElement;
    private playElem: HTMLElement = document.getElementById("play") as HTMLElement;

    generateNewFood(bodies: HTMLCollection) {
        //避免食物出现在蛇身上     
        let x = Math.round(Math.random() * 36) * 10
        let y = Math.round(Math.random() * 40) * 10
        for (let i = bodies.length - 1; i >= 0; i--) {
            let X = (bodies[i] as HTMLElement).offsetLeft;
            let Y = (bodies[i] as HTMLElement).offsetTop;
            if (x == X&& y ==Y) {
                this.generateNewFood(bodies)
                return;
            }
        }
        this.foodElem.style.left = x + "px"
        this.foodElem.style.top = y + "px"
        console.log(x,y);      
    }

    get x() {
        return this.foodElem.offsetLeft
    }

    get y() {
        return this.foodElem.offsetTop
    }

    set x(value) {
        this.foodElem.style.left = value + "px"
    }

    set y(value) {
        this.foodElem.style.top = value + "px"
    }

    reset(){
        this.foodElem.style.left = -10 + "px";
        this.foodElem.style.top = -10 + "px"
    }
}

export default Food