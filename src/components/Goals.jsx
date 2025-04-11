import React from 'react'

export default function Goals() {
  return (
    <div>
        <div className="goals-container">
            <h2>Add New Goal</h2>
            <form className="goal-form">
                <div className="form-group">
                    <label htmlFor="goalTitle">Goal Title</label>
                    <input 
                        type="text" 
                        id="goalTitle" 
                        name="goalTitle" 
                        placeholder="Enter your goal" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="">Select a category</option>
                        <option value="steps">Steps</option>
                        <option value="water">Water</option>
                        <option value="exercice">Exercice</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Add Goal</button>
                
                </form>
                <form>
                    <h2>Set your Progress</h2>
                <div className="form-group">
                    <label htmlFor="progress">Input your Latest activity</label>
                    <input 
                        type='number'
                        placeholder='Your Actvity (steps,liters,minutes) '
                    ></input>
                    
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="">Select a category</option>
                        <option value="steps">Steps</option>
                        <option value="water">Water</option>
                        <option value="exercice">Exercice</option>
                    </select>
                </div>
                
                {/* <div className="form-group">
                    <label htmlFor="deadline">Deadline (optional)</label>
                    <input 
                        type="date" 
                        id="deadline" 
                        name="deadline" 
                    />
                </div> */}
                
                <button type="submit" className="submit-btn">Add Goal</button>
            </form>
        </div>
    </div>
  )
}
