import OrganizedWorker from "./src/organized-workers.js";

const worker = new OrganizedWorker('worker.js');

let response = await worker.call('repeat', 'hello worker', 2);
console.log(response);