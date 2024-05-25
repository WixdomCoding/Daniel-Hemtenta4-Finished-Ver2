import React from "react";
import axios from "axios";

function AddTimeForm() {
  const [form, setForm] = React.useState({
    date: "",
    time: 0,
  });

  const handleChange = (event) => {
    // Updates the form
    setForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isBooked = false;
    await axios
      .get("/api/availableTimes") // Checks if the time is already booked
      .then((res) => {
        let tryDate = form.date + "T" + form.time + ":00.000Z";
        let minutes = parseInt(form.time.split(":")[1]);

        if (minutes === 0) {
          res.data.forEach((time) => {
            if (time.time === tryDate) {
              alert("This time is already booked");
              isBooked = true;
              return;
            }
          });
        } else {
          alert("You have to book a full hour!");
          setForm({
            // Changes the time to the next full hour
            ...form,
            time: form.time.split(":")[0] + ":00",
          });
          isBooked = true;
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
    if (!isBooked) {
        console.log(form);
      // Books the time if it's not already booked
      await axios
        .post("/api/addTime", form)
        .then((res) => {
          setForm({
            // Resets the form
            date: "",
            time: 0,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  return (
    <div className="add-time-form book" onSubmit={handleSubmit}>
      <form action="/api/addTime" method="POST">
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name="date"
            className="dateInput"
            placeholder=""
            onChange={handleChange}
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            name="time"
            className="timeInput"
            placeholder=""
            onChange={handleChange}
            value={form.time}
            required
          />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}

export default AddTimeForm;
