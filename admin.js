document.getElementById("travelForm").addEventListener("submit", e => {
  e.preventDefault();

  const newTravel = {
    city: city.value,
    state: state.value,
    lat: parseFloat(lat.value),
    lng: parseFloat(lng.value),
    startDate: startDate.value,
    endDate: endDate.value
  };

  travels.push(newTravel);

  console.clear();
  console.log("Copy this into data.js 👇");
  console.log(JSON.stringify(travels, null, 2));
});
