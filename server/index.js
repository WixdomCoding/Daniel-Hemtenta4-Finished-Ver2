const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

const app = express(); // Creates an express app

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Functions */
const getDate = () => {
  // Returns the date in the format: "Day, Date Month Year Week WeekNumber"
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ];
  const date = new Date();

  const day = days[date.getDay()];
  const month = months[date.getMonth()];

  startDate = new Date(date.getFullYear(), 0, 1);
  let daysGone = Math.floor((date - startDate) / (24 * 60 * 60 * 1000) + 1); // +1 because it starts at 1 not 0

  let weekNumber = Math.ceil(daysGone / 7);

  const fullDate = `${day}, ${date.getDate()} ${month} ${date.getFullYear()} || Week ${weekNumber}`;
  return fullDate;
};

const getLocations = async () => {
  // Returns the location of the first result from the search
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct?q=Flemmingsberg&limit=5&appid=3f0db14940744c8d40660770a2160b4e"
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getWeather = async () => {
  // Returns the weather of the first result from the search
  try {
    let location = "";
    await getLocations().then((data) => {
      location = data[0];
    });
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=3f0db14940744c8d40660770a2160b4e
      `
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

function addHours(date, hours) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}

app.get("/api", async (req, res) => {
  // Returns the weather and date
  let date = getDate();

  getWeather().then((data) => {
    res.json({ weather: data, currDate: date });
  });
});

app.post("/api/addTime", async (req, res) => {
  // Adds a time to the list of available times
  const { date, time } = req.body;
  const fullDate = Date.parse(`${date} ${time}`);

  var reformedDate = new Date(fullDate);

  reformedDate = addHours(reformedDate, 1); // Adds an hour to the time because PHP IS STUPID!!!

  await prisma.availableTimes
    .create({
      data: {
        time: reformedDate,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("Added a time\n");
  res.json({ added: true });
});

app.get("/api/availableTimes", async (req, res) => {
  // Returns all available times
  const availableTimes = await prisma.availableTimes.findMany();
  res.json(availableTimes);
});

app.post("/api/book", async (req, res) => {
  // Books a meeting
  const { name, email, date, time } = req.body;
  let fullDate = Date.parse(`${date} ${time}`);
  var now = new Date();

  var reformedDate = new Date(fullDate);
  reformedDate = addHours(reformedDate, 1);
  now = addHours(now, 1);

  await prisma.booking
    .create({
      data: {
        createdAt: now,
        name: name,
        email: email,
        bookedTime: reformedDate,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  await prisma.availableTimes.delete({
    where: {
      time: reformedDate,
    },
  });

  console.log("Booked a meeting\n");
  res.json({ booked: true });
});

app.get("/api/bookings", async (req, res) => {
  // Returns all bookings
  const bookings = await prisma.booking.findMany();
  res.json(bookings);
});

app.post("/api/remove", async (req, res) => {
  // Removes a booking
  let { id } = req.body;
  id = parseInt(id);
  await prisma.booking
    .delete({
      where: {
        id: id,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("Removed a meeting\n");
  res.json({ removed: true });
});

app.post("/api/edit", async (req, res) => {
  // Edits a booking
  let { id, name, email, date, time } = req.body;
  const fullDate = Date.parse(`${date} ${time}`);

  var reformedDate = new Date(fullDate);
  reformedDate = addHours(reformedDate, 1);

  id = parseInt(id);
  await prisma.booking
    .update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        bookedTime: reformedDate,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("Edited a meeting\n");
  res.json({ edited: true });
});

app.get("/api/avaiability", async (req, res) => {
  await prisma.available.count().then((count) => {
    if (count === 0) {
      prisma.available.create({
        data: {
          isAvailable: true,
        },
      });
    }
  });
  // Returns the avaiability of the meeting room")
  let isAvailable = await prisma.available.findFirst();

  res.json({ avaiability: isAvailable });
});

app.post("/api/avaiability", async (req, res) => {
  // Changes the avaiability
  const isAvailable = req.body.isAvailable;

  await prisma.available
    .update({
      where: {
        id: 1,
      },
      data: {
        isAvailable: isAvailable,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("Changed avaiability\n");
});

/* Server */

app.listen(PORT, () => {
  // Starts the server
  console.log(`Server listening on ${PORT}\n`);
});
