const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
const multer = require("multer");
const path = require("path")
//multer storage initialization
// const storage = multer.diskStorage({
// destination:"upload",filename:function(req,file,cb){
// cb(null ,file.fieldname+"-"+date.now()+path.ext(file.originalname));
// }
// });
//upload variable initialization
// const upload = multer({
// storage:storage
// }).single("photo")

var upload = multer({
  dest: 'upload/'
});
const ejs = require("ejs");
app.use(express.static("public"));
app.set('view engine', 'ejs');

//mongoose connection.............................................
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/helpDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//mongoose schema...................................................
const formSchema = new mongoose.Schema({
  pin: String,
  filename: String
});
//mongoose model....................................................
const data = new mongoose.model("image", formSchema);

//home route.........................................................
app.get("/", function(req, res) {
  res.render("index");
});
//home route post....................................................

app.post('/', upload.single('photo'), function(req, res, next) {
  const filename = req.file.filename;
const value =  new data({
name:filname,
pin :req.body.pin
});
value.save();
  res.redirect("/");
});
// app.post("/",function(req,res){
//     upload(req,res,function(err){
//       if(err){
//         console.log(err)
//       }else{
//         console.log(req.file);
//         res.send("haha");
//       }
//     });
// const value = new data({
// pin:req.body.pin
// });
// value.save();
//
// });
// });

app.get("/related", function(req, res) {

  res.render("result", {
    name: "images/cere.jpg"
  });

});
app.post("/related", function(req, res) {
  res.redirect("/related");

});

//end................................................................
app.listen(3000, function() {
  console.log("Server is running")
});
