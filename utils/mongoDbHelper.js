var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/todos',{ useNewUrlParser: true });

var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

var userSchema = new mongoose.Schema({
    name:String,
    age:Number,
    note:String
});

var User = mongoose.model('User',userSchema);

var bomPartSchema = new mongoose.Schema({
  partNo:Number,
  partName:String,
  img:String,
  size:String,
  material:String,
  hot:String,
  supplier:String,
  note:String
});

var bomPart = mongoose.model('bomPart',bomPartSchema);

var MID = function(id){
  return mongoose.Types.ObjectId(id);
}

module.exports = {
    todo:Todo,
    user:User,
    bomPart:bomPart,
    getMid:MID
};