import {useState} from 'react';

const TaskEntry = ({isOpen, isClose, isSave}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    if(!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            return alert('Title is required');
        }
        isSave({ title, description });
        setTitle('');
        setDescription('');
        isClose();
    }
return(
    <div className="modal-overlay" onClick={isClose}>
        <div className="new-entry-modal" onClick={(e)=>e.stopPropagation()}>
            <form onSubmit={handleSave}>
                <div className="form-group">
                <label htmlFor="task-title">Title:</label>
                <input type="text" id="task-title" value={title} onChange={e=> setTitle(e.target.value)}/>
                <label htmlFor="task-desc">Description:</label>
                <textarea id="task-desc" value={description} onChange={e=> setDescription(e.target.value)} rows="4"/></div>
                <div className = "modal-action"><button type="submit" className="btn-save">Add</button>
                </div>
            </form>
        </div>
    </div>
)

}

export default TaskEntry;

