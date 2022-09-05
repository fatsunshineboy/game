<template>
    <div class="snakeGame" id="snakeGame" :style={backgroundImage:playBG}>
        <div class="main">
            <div id="play">
                <div id="snake">
                    <div class="head body" id="head"></div>
                    <div id="bodies">
                        <!-- <div class="body"></div> -->
                    </div>
                </div>
                <div id="foods">
                    <div class="food"></div>
                    <div class="food"></div>
                    <div class="food"></div>
                    <div class="food"></div>
                </div>
            </div>
        </div>

        <div class="gameButton">
            <div class="gameButtonTop" @click="goDirection('Up')"><img :src="upUrl" id="gameButtonTop">
            </div>
            <div class="gameButtonRight" @click="goDirection('Right')"><img :src="rightUrl" id="gameButtonRight">
            </div>
            <div class="gameButtonLeft" @click="goDirection('Left')"><img :src="leftUrl" id="gameButtonLeft"></div>
            <div class="gameButtonBottom" @click="goDirection('Down')"><img :src="bottomUrl" id="gameButtonBottom">
            </div>
        </div>

        <div class="record">
            <div id="score">score:0</div>
            <div id="level">level:1</div>
        </div>

        <div class="control">
            <button class="controlItem" @click="start">开始游戏</button>
            <button class="controlItem" @click="reStart">重新开始</button>
            <button class="controlItem" @click="pause">{{ pauseText }}</button>
            <button class="controlItem" @click="showTop">排行</button>
        </div>
        <!-- 重新开始的提示框 -->
        <el-dialog v-model="dialogVisible" width="30%" :show-close="false">
            <span>重新开始会丢失成绩，确定吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancaelHandler">取消</el-button>
                    <el-button type="primary" @click="confirmHandler">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 比赛结束的提示框 -->
        <el-dialog v-model="dialogFormVisible" :title="gameOvertitle" :show-close="false" :close-on-press-escape="false"
            :close-on-click-modal="false">
            <el-form label-position="right" ref="ruleFormRef" :model="ruleForm" :rules="rules">
                <el-form-item label="最终成绩" :label-width="formLabelWidth">
                    <el-input :value="snakeStore.score" disabled />
                </el-form-item>
                <el-form-item label="你的名字" :label-width="formLabelWidth" prop="name">
                    <el-input placeholder="请输入你的名字" v-model="ruleForm.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 排行榜 -->
        <el-drawer v-model="drawer" title="排行榜（仅显示前十名）" :direction="direction" :before-close="handleClose">
            <el-empty :image-size="200" description="暂无排名" v-if="!topStorage.length" />
            <el-timeline v-if="topStorage.length">
                <el-timeline-item :timestamp="`第${index+1}名`" placement="top" v-for="(item,index) in topStorage">
                    <el-card>
                        <h4 style="margin-bottom: 5px;">玩家姓名：{{(item as any).name}}</h4>
                        <h4>得分：{{(item as any).score}}</h4>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-drawer>
        <!-- 比赛结束提示语 -->
        <el-dialog v-model="isShowFail" :close-on-press-escape="false" :show-close="false"
            :close-on-click-modal="false">
            <el-result icon="error" title="游戏结束" :sub-title="`得分：${snakeStore.score}`">
                <template #icon>
                    <img :src="getImageUrl('snake')" />
                </template>
                <template #extra>
                    <el-button type="primary" @click="failBack">{{!shouldRegister?"返回":"登记成绩"}}</el-button>
                </template>
            </el-result>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, nextTick, watch, reactive } from "vue";
import Play from "@/modules/PlayGame";
import { useSnakeStore } from "../store/snake";
import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules, Action } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'

import upUrl from "../assets/image/1x/up.png";
import rightUrl from "../assets/image/1x/right.png";
import bottomUrl from "../assets/image/1x/bottom.png";
import leftUrl from "../assets/image/1x/left.png";

import headUrl from "../assets/image/snake/right.png";

let snakeStore = useSnakeStore();
let play: any;
let pauseText = ref("暂停");
const shouldRegister = ref(false)

// 表单校验规则
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    name: ""
})

const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input your name', trigger: 'blur' },
    ]
})

// 游戏结束
const dialogFormVisible = ref(false)
const isShowFail = ref(false)
const formLabelWidth = '140px'
let gameOvertitle = ref("")

// 游戏结束时的提示的返回按钮
const failBack = function () {
    if (shouldRegister.value) {
        dialogFormVisible.value = true
        isShowFail.value = false
    }
    else {
        play.init()
        isShowFail.value = false
    }
}

// 成绩提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(snakeStore.score);
            // console.log(ruleForm.name);
            changeTop(snakeStore.score, ruleForm.name)
            dialogFormVisible.value = false
            shouldRegister.value = false
            play.init()
        } else {
            ElMessage({
                message: "请输入您的姓名",
                type: "warning"
            })
            console.log('error submit!', fields)
        }

    })
}

watch(() => snakeStore.isTouchWall, (newValue, oldValue) => {
    if (newValue) {
        if (snakeStore.score != 0) {
            isShouldRegister(snakeStore.score)
            gameOvertitle.value = "您撞墙了"
        }
        else {
            isShowFail.value = true
        }
    }
})

watch(() => snakeStore.isEatSelf, (newValue, oldValue) => {
    if (newValue) {
        if (snakeStore.score != 0) {
            isShouldRegister(snakeStore.score)
            gameOvertitle.value = "您吃到自己了"
        }
        else {
            isShowFail.value = true
        }
    }

})

const isShouldRegister = function (score: number) {
    if (localStorage.getItem("top")) {
        let oldObj = JSON.parse(localStorage.getItem("top") as string)
        if (oldObj.length < 10) {
            shouldRegister.value = true;
            isShowFail.value = true
            return
        }
        let tempIndex: any;
        for (let i = 0; i < oldObj.length; i++) {
            if (Number(oldObj[i].score) < Number(score)) {
                tempIndex = i;
                break;
            }
        }
        if (tempIndex == undefined) {
            shouldRegister.value = false;
        }
        else {
            shouldRegister.value = true;
        }
    }
    else {
        shouldRegister.value = true
    }
    console.log(shouldRegister.value);
    isShowFail.value = true
}
// 榜单
const drawer = ref(false)
const direction = ref('rtl')
const activities = [
    {
        content: 'Custom icon',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: MoreFilled,
    },
    {
        content: 'Custom color',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87',
    },
    {
        content: 'Custom size',
        timestamp: '2018-04-03 20:46',
        size: 'large',
    },
    {
        content: 'Custom hollow',
        timestamp: '2018-04-03 20:46',
        type: 'primary',
        hollow: true,
    },
    {
        content: 'Default node',
        timestamp: '2018-04-03 20:46',
    },
]
const topStorage = ref([])
const handleClose = (done: () => void) => {
    if (!snakeStore.isStart) {
        drawer.value = false
    }
    else {
        snakeStore.isPause = !snakeStore.isPause;
        play.run()
        drawer.value = false
    }
}

// 读取本地存储的内容
const useLocalStorage = function () {
    let temp = JSON.parse(localStorage.getItem("top") as string)
    if (!temp) {
        topStorage.value = []
        return
    }
    temp.map((item: any) => {
        item.score = Number(item.score)
    })
    topStorage.value = temp
}

const changeTop = function (score: any, name: string) {
    if (localStorage.getItem("top")) {
        let oldObj = JSON.parse(localStorage.getItem("top") as string)
        let tempIndex: any;

        console.log(oldObj);

        for (let i = 0; i < oldObj.length; i++) {
            if (Number(oldObj[i].score) < Number(score)) {
                tempIndex = i;
                break;
            }
        }
        if (tempIndex == undefined) {
            tempIndex = oldObj.length + 1;
        }
        let tempObj = { score, name }
        oldObj.splice(tempIndex, 0, tempObj)
        oldObj = oldObj.length > 10 ? oldObj.splice(9, oldObj.length - 1) : oldObj
        localStorage.setItem("top", JSON.stringify(oldObj))
    }
    else {
        let tempString = {
            name: name,
            score: score
        }
        let tempTop: Array<object> = []
        tempTop.push(tempString)
        localStorage.setItem("top", JSON.stringify(tempTop))
    }
}

// 重新开始的对话框
const dialogVisible = ref(false);
function cancaelHandler() {
    snakeStore.isPause = !snakeStore.isPause;
    play.run()
    dialogVisible.value = false
}
function confirmHandler() {
    dialogVisible.value = false
    nextTick(() => {
        play.init();
        play.playGame()
    });
}

onBeforeMount(() => {
    nextTick(() => {
        play = new Play();
    });
});

function start() {

    if (snakeStore.isStart) {
        console.log(123)
        ElMessage({
            message: "游戏正在进行中",
            type: "warning"
        })
    } else {
        nextTick(() => {
            play.init();
            play.playGame()
        });
        ElMessage({
            message: "游戏开始",
            type: "success"
        });
    }
}

function reStart() {
    dialogVisible.value = true;
    snakeStore.isPause = !snakeStore.isPause;
}

function pause() {
    if (!snakeStore.isStart) {
        ElMessage({
            message: "请先开始游戏",
            type: "warning"
        });
        return
    }
    snakeStore.isPause = !snakeStore.isPause;
    pauseText.value = snakeStore.isPause ? "继续" : "暂停";
    play.run();
}

function showTop() {
    useLocalStorage()
    if (!snakeStore.isStart) {
        drawer.value = true;
    }
    else {
        snakeStore.isPause = !snakeStore.isPause;
        drawer.value = true;
    }

}

// 点击按钮方向改变
const goDirection = function (direction: string) {
    let fun = "go" + direction
    play[fun]()
}

const getImageUrl = function (name: string) {
    return new URL(`../assets/image/${name}.png`, import.meta.url).href;
}

let playBG = "url(" + getImageUrl('game') + ")"

</script>

<style lang="scss" >
@import "../style/snake.scss"
</style>
