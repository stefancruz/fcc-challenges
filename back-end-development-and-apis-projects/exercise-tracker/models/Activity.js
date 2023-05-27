let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let activitySchema = new mongoose.Schema({
  UserId: {
    type: ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    //required: true
  },
  duration: {
    type: Number,
    required: true
  },

}, {
  toJSON: {
    transform: function(doc, ret) {
      if(ret.date){
        ret.date = ret.date.toDateString();
      }
    }
  }
});

module.exports = mongoose.model('Activity', activitySchema);
