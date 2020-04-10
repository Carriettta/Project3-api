const mongoose = require('mongoose');

const Task = mongoose.model("tasks", {
    title: String,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = Task;