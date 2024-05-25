import React from "react";
import axios from "axios";

function Admin() {
    const [bookings, setBookings] = React.useState(null);
    var loggedIn = "";
    if (localStorage.getItem("loggedIn") === null) {
        loggedIn = false;
    } else {
        loggedIn = true;
    }

    React.useEffect(() => {
        fetch("/api/bookings")
            .then((res) => res.json())
            .then((data) => setBookings(data));
    }, []);

    const handleRemove = async (event) => {
        const id = event.target.id.split("remove")[1];
        await axios.post('/api/remove', { id: id })
            .then(res => {
                console.log(res.data);
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleEdit = async (event) => {
        const id = event.target.id.split("edit")[1];
        let data = null;

        bookings.forEach(booking => {
            if (booking.id === parseInt(id)) {
                data = booking;
            }
        });

        const name = prompt("Enter a new name:", data.name);
        const email = prompt("Enter a new email:", data.email);
        const date = prompt("Enter a new date (ex. '2024-01-10'):", (data.bookedTime).split("T")[0]);
        const time = prompt("Enter a new time (ex. '12:15'):", (data.bookedTime).split("T")[1].split(":00.000Z")[0]);
        await axios.post('/api/edit', { id: id, name: name, email: email, date: date, time: time })
            .then(res => {
                console.log(res.data);
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        if (username === "admin" && password === "admin") {
            localStorage.setItem("loggedIn", true);
            window.location.reload();
        }
    }

    const handleAvailable = async (e) => {
        await axios.post('/api/avaiability', { isAvailable: true });
    }

    const handleUnavailable = async (e) => {
        await axios.post('/api/avaiability', { isAvailable: false });
    }

    return (
        <div className="admin">
            {loggedIn ? <div>
                <h1>Admin</h1>
                <div className="adminButtons">
                    <button className="logout adminButton" onClick={() => { localStorage.removeItem("loggedIn"); window.location.reload(); }}>Logout</button>
                    <button className="available adminButton" onClick={handleAvailable}>Available</button>
                    <button className="unavailable adminButton" onClick={handleUnavailable}>Busy</button>
                </div>
                <table className="bookings">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Booked times</th>
                        </tr>
                        {bookings ? bookings.map((booking) => (
                            <tr className="booking" key={booking.id}>
                                <td>{booking.name}</td>
                                <td>{booking.email}</td>
                                <td>{(booking.bookedTime).split("T")[0] + " | " + (booking.bookedTime).split("T")[1].split(":00.000Z")[0]}</td>
                                <div className="buttons">
                                    <button className="delete tableButton" id={"remove" + booking.id} onClick={handleRemove}>Delete</button>
                                    <button className="edit tableButton" id={"edit" + booking.id} onClick={handleEdit}>Edit</button>
                                </div>
                            </tr>
                        )) : "Loading..."}
                    </tbody>
                </table>
            </div> : <div>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required value="admin" />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required value="admin" />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>}
        </div>
    );
}

export default Admin;