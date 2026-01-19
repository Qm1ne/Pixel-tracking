import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [events, setEvents] = useState([])

    useEffect(() => {
        // TODO: Fetch events from backend
        // fetch('http://localhost:3000/api/v1/stats')
    }, [])

    return (
        <div className="container">
            <header>
                <h1>Analytics Dashboard</h1>
                <p>Real-time visitor tracking</p>
            </header>
            <main>
                <div className="card">
                    <h2>Total Pageviews</h2>
                    <div className="stat">0</div>
                </div>
                <div className="card">
                    <h2>Active Sessions</h2>
                    <div className="stat">0</div>
                </div>
            </main>
        </div>
    )
}

export default App
