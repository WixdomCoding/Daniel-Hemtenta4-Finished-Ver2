import React from "react";

function CurrentDate() {
  const [date, setDate] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setDate(data.currDate));
  }, []);

  return (
    <div className="current-date">
      <h3>{date ? date : "Loading..."}</h3>
    </div>
  );
}

export default CurrentDate;
