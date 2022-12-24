//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _=require("lodash");

const app = express();
//var items=["Buy Food","Cook Food","Eat Food"];
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin-asif:Messi10@cluster0.0yy0jzo.mongodb.net/todolistDB');

const itemsSchema={
  name:String
};
const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist!"
});
const item2=new Item({
  name:"Hit the + button to add a new item"
});
const item3=new Item({
  name:"<-- Hit this to delete an item"
});
const defaultItems=[item1,item2,item3];

var workItems=[];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  let day=date();
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err)
        console.log(err);
        else
        console.log("Default items inserted successfully");
      });
    }
    res.render("list", {
      kindOfDay: "Today",newItems:foundItems,
    });
  })



});

const listSchema={
  name:String,
  items:[itemsSchema]
}
const List=mongoose.model("List",listSchema);


app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,docs){
    if(docs===null)
    {
      console.log(customListName);
      const list =new List({
        name:customListName,
        items:defaultItems
      })
      list.save();
      res.redirect("/"+customListName);
     }
      else{
        res.render("list",{
          kindOfDay:customListName,newItems:docs.items
        });
      }

  });

});

// app.get("/work",function(req,res){
//   res.render("list",{
//     kindOfDay:"Work List", newItems:workItems
//   })
// })

// app.post("/work",function(req,res){
//     let item=req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;

  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err)
      console.log("successfullydeleted");res.redirect("/");
    });
  } else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},
      function(err,foundList){
        if(!err){
          res.redirect("/"+listName);
        }
      }
    )
  }

})

app.post("/",function(req,res){
  const itemName=req.body.newItem;
  const listName=req.body.list;

  const newItem=new Item({
    name:itemName
  });

  if(listName==="Today"){
    newItem.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(newItem);
      foundList.save();
    })
    res.redirect("/"+listName);
  }

});

app.listen(3000, function() {
  console.log("server running on port 3000");
});
