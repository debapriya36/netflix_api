const mongoose = require("mongoose");

const NetfixSchema = new mongoose.Schema({
  show_id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["Movie", "TV Show"],
    required: true,
  },
  director: [
    {
      type: String,
    },
  ],
  title: { 
    type: String, 
    required: true 
  },
  cast: [
    {
      type: String,
    },
  ],
  country: [
    {
      type: String,
    },
  ],
  date_added: { 
    type: Date
},
  release_year: { 
    type: Number 
},
  rating: { 
    type: String 
},
  duration: { 
    type: String 
},
  listed_in: [
    { 
        type: String
 }],
  description: { 
    type: String 
 }
});

const SHOW = mongoose.model("SHOW", NetfixSchema);
module.exports = SHOW;