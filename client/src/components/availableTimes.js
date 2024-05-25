import React from "react";
import axios from "axios";

function ShowAvailableTimes() {
  const [availableTimes, setAvailableTimes] = React.useState([]);

  React.useEffect(() => {
    axios.get("/api/availableTimes").then((res) => {
      setAvailableTimes(res.data);
    });
  }, []);

  return (
    <div className="available-times">
      <h3>The Available Times</h3>
      <ul>
        {availableTimes.map((time) => (
          <li key={time._id}>
            {time.time.split("T")[0]} {time.time.split("T")[1].split(".")[0]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowAvailableTimes;
