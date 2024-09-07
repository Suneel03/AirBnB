
const mongoose = require('mongoose');
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{
 console.log('connected to DB');
})
.catch(err => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
} 

// const initDB = async() =>{
//     await Listing.deleteMany({});
   

// // Modify initData.data and randomly assign a category
// const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"];
// initData.data = initData.data.map((obj) => ({
//   ...obj,
//   owner:"66cc2855cd32887662445e51",//if owner doesnt exist

// }));
//     await Listing.insertMany(initData.data);
//     console.log('Data was initialised successfully');
// }



const initDB = async () => {
    await Listing.deleteMany({});
  
    // Default values
    const defaultCoordinates = [79.4192, 13.6288];
    const categories = [
      "Trending", "Rooms", "Iconic Cities", "Mountains", "Castles",
      "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"
    ];
  
    // Modify initData.data
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "66cc2855cd32887662445e51", // Example owner ID
      geometry: {
        type: 'Point', // Static value for GeoJSON type
        coordinates: obj.coordinates || defaultCoordinates, // Default coordinates if missing
        category: obj.category || categories[Math.floor(Math.random() * categories.length)] // Random category if missing
      }
    }));
  
    await Listing.insertMany(initData.data);
    console.log('Data was initialised successfully');
  };
  

initDB();