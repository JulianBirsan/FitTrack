import { useEffect, useState } from "react";
import "../styles/Home.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Axios from 'axios';

const Home = () => {
    const [viewMode, setViewMode] = useState({"abc": false, "xyz": false});
    const [allWorkouts, setAllWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (e) => {
        setSelectedDate(e);
        Axios.get('http://localhost:3001/api/get', {
            params: {
                date: e
            }
        }).then((response) => {

            let workoutQuery = [];

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
            setAllWorkouts(workoutQuery);
        });
    };

    useEffect(() => {
        Axios.get('http://localhost:3001/api/get').then((response) => {

            let workoutQuery = [];

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
            setAllWorkouts(workoutQuery);
        });
    }, []);

    return (
        <div className="workout-list">
            <div className="home-header">
                <h1 className="title">FitTrack</h1>
                <a href="/edit/new" className="new-workout-link">
                New Workout
                </a>
                <div className="date-field">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        required={true}
                        className="date-picker"
                        placeholderText="Filter by Date"
                        wrapperClassName="datePicker"
                    ></DatePicker>
                </div>
            </div>
            <div className="workouts-container">
                {
                    allWorkouts.length ? <div>{allWorkouts.map((workout, index) => (
                        <div key={index} className="workout-item">
                            <div className="workout-header">
                                <span className="workout-date">{workout.date}</span>
                                <a href={`/edit/${workout.id}`}>
                                    <button className="view-button">
                                        Edit
                                    </button>
                                </a>
                                <button
                                    onClick={() => {
                                    setViewMode((viewMode) => {
                                        let newViewMode = { ...viewMode };
                                        newViewMode[workout.id] = !viewMode[workout.id];
                                        return newViewMode;
                                    })
                                }}
                                className="view-button"
                                >
                                {viewMode[workout.id] ? "Hide" : "View"}
                                </button>
                                <button className="delete-button" onClick={() => {
                                    Axios.delete('http://localhost:3001/api/delete', {
                                        data: {
                                            id: workout.id
                                        }
                                    });
                                    window.location.href = '/';
                                }}>
                                    Delete
                                </button>
                            </div>
                            {viewMode[workout.id] && (
                                <div className="workout-body">
                                    <div className="exercise-list">
                                        {workout.exercises.map((exercise, index) => (
                                        <div key={index} className="exercise-item">
                                        <div className="exercise-name">{exercise.name}</div>
                                        <div className="set-list">
                                            {exercise.sets.map((set, ind) => (
                                            <div key={ind} className="set-item">
                                                <span>{`${set[0]} reps, ${set[1]}`}</span>
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        ))}</div> : <div className="no-data">No Data to Display.</div>
                }
            </div>
        </div>
      );
}

export default Home;