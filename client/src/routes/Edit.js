import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import "../styles/Edit.css";

const Edit = () => {
    const [exName, setExName] = useState('');
    const [getNew, setGetNew] = useState(false);
    const location = useLocation();

    const id = location.pathname.split('/')[2];
    const [collapsed, setCollapsed] = useState([]);
    
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (e) => {
        setSelectedDate(e);
    };

    const generateId = () => {
        return Math.random().toString(36).slice(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/api/insert', {
            id: id === "new" ? generateId() : id,
            date: selectedDate,
            exercises: data,
        });
        window.location.href = '/';
    };

    useEffect(() => {
        Axios.get('http://localhost:3001/api/get', {
            params: {
                id: id === "new" ? null : id
            }
        }).then((response) => {
            console.log('response');
            console.log(response);
            let workoutQuery = [];
            if(id !== "new") {
                response.data.forEach((entry) => {
                    if(workoutQuery.length && workoutQuery[workoutQuery.length - 1].id === entry.id) {
                        const last = workoutQuery.length - 1;
                        if(workoutQuery[last].exercises[workoutQuery[last].exercises.length - 1].name === entry.exercise) {
                            workoutQuery[last].exercises[workoutQuery[last].exercises.length - 1].sets.push([entry.reps, entry.weight]);
                        } else {
                            workoutQuery[last].exercises.push({
                                name: entry.exercise,
                                sets: [
                                    [entry.reps, entry.weight]
                                ]
                            });
                        }
                    } else {
                        workoutQuery.push({
                            id: entry.id,
                            date: entry.date.split('T')[0],
                            exercises: [
                                {
                                    name: entry.exercise,
                                    sets: [
                                        [entry.reps, entry.weight]
                                    ]
                                }
    
                            ]
                        });
                    }
                });
            }
            let collapsedArray = [];
            if(workoutQuery.length) {
                setData(workoutQuery[0].exercises);
                setSelectedDate(workoutQuery[0].date ? new Date(workoutQuery[0].date) : null);
                for(let i = 0; i < workoutQuery[0].exercises.length; i++) {
                    collapsedArray.push(false);
                }
            }
            setCollapsed(collapsedArray);
        });
    }, []);

    return (
        <div className="exercise-form">
    <div className="edit-header">
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                required={true}
                className="date-picker"
                placeholderText="Enter Date"
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
                setCollapsed((collapsed) => [...collapsed, 0]);
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
                <button className="cancel-button" onClick={() => {
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
            <button className="cancel-button">
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
                <label>Reps: </label>
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
                <label>Weight: </label>
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
            <div className='exercise-buttons'>
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
                <button className="delete-button" onClick={() => {
                    setData((data) => {
                        const newData = [...data];
                        newData.splice(index, 1);
                        console.log(newData);
                        return newData;
                    })
                }}>
                    Delete
                </button>
            </div>
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