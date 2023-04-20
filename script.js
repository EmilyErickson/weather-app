function getData(location) {
  fetch(
    "https://api.weatherapi.com/v1/current.json?key=df411b097e7446288cd221831231904&q=" +
      `${location}`,
    {
      mode: "cors",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response.current);
    });
}

getData("Lusaka");
