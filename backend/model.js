const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required : true,
        trim: true
    },
    description : {
        type : String,
        default: ""
    },
    status: {
        type: String,
        enum: ['Todo', "In-progress", "Done"],
        default: "Todo"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);