import {Manager} from "./src/organized-workers.js";

const mainThread = new Manager()
mainThread.register('repeat', (string, count) => {
    let answer = ""
    for (let i = 0; i < count; i++) {
        answer += string + " "
    }
    return answer.trim()
})