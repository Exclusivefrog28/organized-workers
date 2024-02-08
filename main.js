import WorkerRoute from "./src/organized-workers.js";

const worker = new WorkerRoute('worker.js');

let response = await worker.call('repeat', 'hello worker', 2);
console.log(response);