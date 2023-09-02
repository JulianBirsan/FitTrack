import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import { workouts } from './Home';
import Axios from 'axios';
import "../styles/Edit.css";

const Edit = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [exName, setExName] = useState('');
    const [getNew, setGetNew] = useState(false);
    const location = useLocation();

    const id = location.pathname.split('/')[2];
    let thisWorkout = [];
    workouts.forEach((workout) => {
        if(workout.id === id) thisWorkout = workout.exercises;
    });
    let collapsedArray = [];
    for(let i = 0; i < thisWorkout.length; i++) {
        collapsedArray.push(false);
    }
    const [collapsed, setCollapsed] = useState(collapsedArray);
    
    const [data, setData] = useState(thisWorkout);

    const handleDateChange = (e) => {
        setSelectedDate(e);
    };

    const handleSubmit = () => {
        Axios.post('http://localhost:3001/api/insert', {
            id: "ok",
            title: "ok",
            date: "ok",
            exercises: [],
        });
        console.log("submitted");
    };

    return (
        <div className="exercise-form">
    <div className="edit-header">
        <div>
            <label>Date: </label>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                required={true}
                className="date-picker"
                />
        </div>
        <button
            onClick={() => {
        setGetNew(true);
        }}
        className="add-exercise-button"
        >
        Add Exercise
        </button>
        {getNew && (
        <dialog open className="dialog">
            <form
                onSubmit={(e) =>
                {
                const newExercise = {
                name: exName,
                sets: [],
                };
                setData((data) => [...data, newExercise]);
                setGetNew(false);
                setExName("");
                }}
                >
                <div className="dialog-buttons">
                <label>Exercise Name:</label>
                <input
                    type="text"
                    required={true}
                    value={exName}
                    onChange={(e) => {
                setExName(e.target.value);
                }}
                className="input-field"
                />
                <button type="Submit" className="ok-button">
                OK
                </button>
                <button className="ok-button" onClick={() => {
                setGetNew(false);
                setExName("");
                }}>
                Cancel
                </button>
                </div>
            </form>
        </dialog>
        )}
        <div className='header-buttons'>
            <form onSubmit={handleSubmit} className='form-button'>
                <button type="Submit" className="ok-button">
                OK
                </button>
            </form>
            <a href="/">
            <button className="ok-button">
            Cancel
            </button>
            </a>
        </div>
    </div>
    <div className="content-container">
        {data.map((exercise, index) => {
        return (
        <div key={index} className="exercise-container">
            <div className='exercise-header'>
                <div className="exercise-name">{exercise.name}</div>
                <button className="collapse-button" onClick={() => {
                setCollapsed((prevCollapsed) => {
                const newCollapsed = [...prevCollapsed];
                newCollapsed[index] = !newCollapsed[index]; 
                return newCollapsed; 
                });
                }}>{collapsed[index] ? "Expand" : "Collapse"}</button>
            </div>
            {!collapsed[index] && 
            <>
            <div>
                {exercise.sets.map((set, ind) => {
                return (
                <div key={ind} className="set-container">
                <span>
                <label>Reps:</label>
                <input
                    type="number"
                    value={set[0]}
                    onChange={(e) => {
                const newData = [...data];
                newData[index].sets[ind][0] = e.target.value;
                setData(newData);
                }}
                className="input-field"
                />
                </span>
                <span>
                <label>Weight:</label>
                <input
                    type="text"
                    value={set[1]}
                    onChange={(e) => {
                const newData = [...data];
                newData[index].sets[ind][1] = e.target.value;
                setData(newData);
                }}
                className="input-field"
                />
                </span>
                </div>
                );
                })}
            </div>
            <button
                onClick={() => {
            const newData = [...data];
            newData[index].sets.push([0, "0"]);
            setData(newData);
            }}
            className="add-set-button"
            >
            Add Set
            </button>
            </>
            }
        </div>
        );
        })}
    </div>
    </div>
      );
}

export default Edit;