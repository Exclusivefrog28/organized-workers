function WorkerRoute(workerPath) {
    const reports = {};
    const worker = new Worker(workerPath, {type: 'module'});

    worker.onerror = (e) => {
        console.log(e);
    }

    this.register = (name, callback) => {
        reports[name] = (...args) => {
            const result = callback(...args);
            if (result !== undefined) postMessage({name: name, args: [result]});
        };
        return this;
    }

    this.registerAsync = (name, callback) => {
        reports[name] = (...args) => {
            callback(...args).then(result => postMessage({name: name, args: [result]}));
        };
        return this;
    }

    this.call = (name, ...args) => {
        const promise = new Promise((resolve, reject) => {
            reports[name] = (result) => {
                resolve(result);
            }
        })
        worker.postMessage({name: name, args: args});
        return promise
    }

    worker.onmessage = (e) => {
        if (e.data.name in reports) {
            reports[e.data.name](...e.data.args);
        } else {
            throw new ReferenceError(`Callback with name \"${e.data.name}\" has not been registered!`);
        }
    }
}

export function ManagerRoute() {
    const jobs = {};

    this.register = (name, func) => {
        jobs[name] = (...args) => {
            const result = func(...args);
            if (result !== undefined) postMessage({name: name, args: [result]});
        };
        return this;
    }

    this.registerAsync = (name, callback) => {
        jobs[name] = (...args) => {
            callback(...args).then(result => postMessage({name: name, args: [result]}));
        };
        return this;
    }

    this.call = (name, ...args) => {
        const promise = new Promise((resolve, reject) => {
            jobs[name] = (result) => {
                resolve(result);
            }
        })
        postMessage({name: name, args: args});
        return promise
    }

    onmessage = (e) => {
        if (e.data.name in jobs) {
            jobs[e.data.name](...e.data.args);
        } else {
            throw new ReferenceError(`Function with name \"${e.data.name}\" has not been registered!`);
        }
    }

}

export default WorkerRoute;