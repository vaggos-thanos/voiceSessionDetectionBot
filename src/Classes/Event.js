class Event {
    constructor(name, once) {
        this.name = name;
        this.once = once == undefined ? false : once;
    }

    run(...args) {}
}

module.exports = Event;