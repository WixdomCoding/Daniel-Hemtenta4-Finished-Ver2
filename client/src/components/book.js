import React, { useState } from "react";
import axios from "axios";

const Book = (props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);

  const handleChange = async (event) => {
    // Updates the form
    setForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name === "date") {
      await handleDateChange(event.target.value);
    }
  };

  const handleDateChange = async (date) => {
    setAvailableTimes([]); // Resets the available times
    let temp = [];
    // Checks if there is an available time
    await axios.get("/api/availableTimes").then((res) => {
      let tryDate = date;
      if (res.data.length === 0) {
        alert("There are no available times to book");
        return;
      } else {
        res.data.forEach((time) => {
          let date = time.time.split("T")[0];
          if (date === tryDate) {
            temp.push(time);
          }
        });
        if (temp.length === 0) {
          alert("There are no available times to book this date"); // This for now
        } else {
          let arr = temp;
          arr.sort((a, b) => {
            return new Date(a.time) - new Date(b.time);
          });
          setAvailableTimes(arr);
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("/api/book", form).then((res) => {
      setForm({
        // Resets the form
        name: "",
        email: "",
        date: "",
        time: "",
      });
    });
  };

  return (
    <div className="book">
      <form action="" method="post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={handleChange}
            value={form.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={handleChange}
            value={form.email}
          />
        </div>
        <div>
          <label htmlFor="date">Date and time:</label>
          <div className="timeInputs">
            <input
              type="date"
              id="date"
              name="date"
              min={new Date().toISOString().split("T")[0]}
              required
              value={form.date}
              onChange={handleChange}
            />
            <input
              disabled={form.date === ""}
              autoComplete="off"
              s
              list="times"
              id="time"
              name="time"
              required
              onChange={handleChange}
              value={form.time}
            />
            <datalist id="times">
              {availableTimes.map((time) => (
                <option
                  key={time.id}
                  value={time.time.split("T")[1].split(":00.000Z")[0]}
                />
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Book;
