
// const filteredData = airportDetails.filter((entry) => entry.iata_code !== "");
// const json = JSON.stringify(filteredData);
// console.log(json);



// const updatedData = airportDetails.map((item) => {
//     const { home_link,local_code,gps_code,scheduled_service,type,elevation_ft, ...rest } = item;
//     return rest;
//   });
//   const jsonData = JSON.stringify(updatedData);
//   console.log(jsonData);



// const updatedData = airportDetails.map((item) => {
//     if (item.iso_country === "US") {
//       return {
//         ...item,
//         flag: "https://flagsapi.com/US/flat/64.png"
//       };
//     }
//     return item;
//   });
//   const jsonData = JSON.stringify(updatedData);
//   console.log(jsonData);

export default airportDetails ;