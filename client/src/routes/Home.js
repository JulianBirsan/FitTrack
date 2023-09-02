import { useEffect, useState } from "react";
import "../styles/Home.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Axios from 'axios';

export const workouts = [
    {
        "id": "abc",
        "date": "08/08/2023",
        "exercises": [
            {
                "name": "bench press",
                "sets": [
                    [9, 185],
                    [9, 185],
                    [8, 185],
                    [7, 185]
                ]
            },
            {
                "name": "incline dumbell press",
                "sets": [
                    [5, 80],
                    [5, 80],
                    [4, 80],
                    [5, 80]
                ]
            },
            {
                "name": "cable lateral raise",
                "sets": [
                    [8, 12.5],
                    [8, 12.5],
                    [7, 12.5],
                    [7, 12.5]
                ]
            }
        ]
    },
    {   
        "id": "xyz",
        "date": "08/08/2023",
        "exercises": [
            {
                "name": "bench press",
                "sets": [
                    [185, 9],
                    [185, 9],
                    [185, 8],
                    [185, 7]
                ]
            },
            {
                "name": "incline dumbell press",
                "sets": [
                    [80, 5],
                    [80, 5],
                    [80, 4],
                    [80, 5]
                ]
            },
            {
                "name": "cable lateral raise",
                "sets": [
                    [12.5, 8],
                    [12.5, 8],
                    [12.5, 7],
                    [12.5, 7]
                ]
            }
        ]
    },
];

const Home = () => {
    const [viewMode, setViewMode] = useState({"abc": false, "xyz": false});
    const [allWorkouts, setAllWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (e) => {
        setSelectedDate(e);
    };

    useEffect(() => {
        Axios.get('http://localhost:3001/api/get').then((response) => {
            setAllWorkouts([]);
        });
    }, []);

    return (
        <div className="workout-list">
            <div className="home-header">
                <h1 className="title">FitTrack</h1>
                <a href="/edit/x" className="new-workout-link">
                New Workout
                </a>
                <div className="date-field">
                    <label>Filter by Date: </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        required={true}
                        className="date-picker"
                    ></DatePicker>
                </div>
            </div>
            <div className="workouts-container">
            {workouts.map((workout, index) => (
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
                    View
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
                                    <span>{`${set[1]} reps, ${set[0]}lbs`}</span>
                                </div>
                                ))}
                            </div>
                            </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            ))}
            </div>
        </div>
      );
}

export default Home;