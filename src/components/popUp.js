import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/todoSlice';

function PopUp({showModal,setShowModal}) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
    
      const [formErrors, setFormErrors] = useState({
        title: false,
        dueDate: false
      });
    
      const openModal = () => setShowModal(true);
      const closeModal = () => {
        setShowModal(false);
    
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium'
        });
        setFormErrors({
          title: false,
          dueDate: false
        });
      };
    
      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [id]: value
        }));
        
    
        if (id === 'title' || id === 'dueDate') {
          setFormErrors(prev => ({
            ...prev,
            [id]: false
          }));
        }
      };
    
      const validateForm = () => {
        const errors = {
          title: !formData.title.trim(),
          dueDate: false
        };
    
        if (formData.dueDate) {
          const selectedDate = new Date(formData.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          errors.dueDate = selectedDate < today;
        }
    
        setFormErrors(errors);
        return !errors.title && !errors.dueDate;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
          const newTask = {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : '',
            priority: formData.priority,
            status: 'todo'
          };
          dispatch(addTodo(newTask));
          closeModal();
        }
      };
  return (
    <>
    {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Task</h2>
            <form id="taskForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title*</label>
                <input 
                  type="text" 
                  id="title" 
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {formErrors.title && (
                  <div className="error-message">Title is required</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input 
                  type="date" 
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
                {formErrors.dueDate && (
                  <div className="error-message">Due date must be in the future</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select 
                  id="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-create">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default PopUp
