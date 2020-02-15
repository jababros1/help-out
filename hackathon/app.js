const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

const path = require("path")

//multer initialization
const multer = require('multer');

const multerconf = {
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/upload/')
    },
    filename: function(req, file, cb) {

      const ext = file.mimetype.split("/")[1];
      cb(null, Date.now() + "." + ext)

    }
  })
}

//ejs initialization
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
  filename: String,
  adress: String
});
//mongoose model....................................................
const data = new mongoose.model("image", formSchema);

//home route.........................................................
app.get("/", function(req, res) {
  res.render("index");
});
//home route post....................................................

app.post('/', multer(multerconf).single("photo"), function(req, res, next) {
  console.log(req.file.filename)
  const filename = req.file.filename;
  const value = new data({
    pin: req.body.pin,
    filename: filename,
    adress: req.body.address
  });
  value.save();

  res.redirect("/");
});

app.get("/related", function(req, res) {

  res.render("result", {
    name: "images/cere.jpg"
  });

});
//search result page route with ejs rendering
app.post("/related", function(req, res) {
  const pin = req.body.pin;
  data.find({}, function(err, results) {
    for (var i = 0; i < results.length; i++) {
      if (results[i].pin === pin) {
        console.log(results[i].filename)
        res.render("result", {
          pin: pin,
          adress: results
        })
      }
    }
    console.log(results);
  });
});

//deletion route of the completed work
app.post("/delete", function(req, res) {
  const ID = req.body.checkbox
  item.findByIdAndRemove(ID, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/")
    }
  })
});

//end................................................................
app.listen(3000, function() {
  console.log("Server is running")
});
