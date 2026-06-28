const express = require("express");
const router = express.Router();
const task = require('./model.js');

router.get('/tasks', async (req, res)=>{
    try{
        const response = await task.find({}).sort({createdAt :-1});
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


router.post('/tasks/new', async (req, res)=>{
    const {title, description} = req.body;
    try{
        const newTask = new task({title, description: description || ''});
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


router.put('/tasks/:id', async (req, res)=>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        const response = await task.findByIdAndUpdate(id, {status}, {new: true});
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/tasks/:id', async(req, res)=>{
    const {id} = req.params;
    try{
        const deleteTask = await task.findByIdAndDelete(id);
        if(!deleteTask){
            return res.status(404).json({message: 'Task not found'});
        };
        res.status(200).json({message: 'Task deleted successfully'});

    }catch(error){
        res.status(500).json({message: error.message});
    }
})

module.exports = router;

