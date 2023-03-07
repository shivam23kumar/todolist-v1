const express = require("express");
const bodyParser = require("body-parser");

// step-1 defining mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// step-2 connecting mongoose to the server
mongoose.connect("mongodb+srv://sk5087323:Mummypapa2123%40@cluster0.922mtyv.mongodb.net/todolistDB");


// step-3 creating schema
const itemsSchema = new Schema({
  name: String
})

// step-4 creating model
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:"Hit the + button to add a new item."
})

const defaultItems = [item1];


const items=[];

const workItems=[];

app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({}).then(function(defaultItems){
    if(defaultItems===0){
      Item.insertMany(defaultItems);
      res.redirect("/");
    }else{
      res.render("list", {listTitle: day, newListItems: defaultItems});
    }
  })
  
})

  


app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  })
  item.save();
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});



app.post("/delete", function(req, res) {
  
  const checkedItemId = req.body.deletion;
  
  Item.deleteOne({_id:checkedItemId}).then(function(){
    console.log("Data deleted"); 
    res.redirect("/");// Success
  }).catch(function(error){
      console.log(error); // Failure
  });
  

 
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

