//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//** connecting wikiDB database to this project
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

//** schema of the data to be stored
//** name articleSchema with two fields title and content
const articleSchema = {
  title: String,
  content: String
};

//** this creates a collection/table called Articles(plural of Article) that will be accessed through constant Article
const Article = mongoose.model("Article", articleSchema);

//** GET
//** getting resources from the /articles route
// app.get("/articles",function(req,res){
//   Article.find(function(err,foundArticles){
//     // console.log(foundArticles);
//     if(!err)
//       res.send(foundArticles);
//     else
//       res.send(err);
//   });
// });
//
// //**POST
// app.post("/articles",function(req,res){
//
//   //**postin gis done here through postman application
//   // console.log(req.body.title);
//   // console.log(req.body.content);
//
// //**creating a new object of Article type to be added in the database
//   const newArticle =new Article({
//     title:req.body.title,
//     content:req.body.content
//   });
//
//
// //**saving the object in the database
//   newArticle.save(function(err){
//     if(!err)
//       res.send("Successfully added a new article.");
//     else
//       res.send(err);
//   });
// });
//
// //**DELETE
// app.delete("/articles",function(req,res){
//     Article.deleteMany(function(err){
//       if(!err)
//         console.log("Successfully deleted");
//       else
//         console.log(err);
//     });
// });

//**requests targeting all articles
//**chained route handlers
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      // console.log(foundArticles);
      if (!err)
        res.send(foundArticles);
      else
        res.send(err);
    });
  })
  .post(function(req, res) {

    //**postin gis done here through postman application
    // console.log(req.body.title);
    // console.log(req.body.content);

    //**creating a new object of Article type to be added in the database
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });


    //**saving the object in the database
    newArticle.save(function(err) {
      if (!err)
        res.send("Successfully added a new article.");
      else
        res.send(err);
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err)
        console.log("Successfully deleted");
      else
        console.log(err);
    });
  });

//**requests targeting a specific route
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
    if(foundArticle)
      res.send(foundArticle);
    else
      res.send("Article not found");
  });
})
.put(function(req,res){
  Article.replaceOne(
    { title:req.params.articleTitle },
    { title:req.body.title , content:req.body.content},
    // {overwrite:true},
    function(err){
      if(!err)
        res.send("Successfully updated");
      else
        res.send("error");
    }
  );
})
.delete(function(req,res){
  Article.deleteOne(
    {title : req.params.articleTitle},
    function(err){
      if(!err)
        res.send("Successfully deleted one aticle");
      else
        res.send("Cannot delete");
    }
  );
});
// .post(req,res){
//   const newArticle=new Article({
//     title : req.body.title,
//     content : req.body.content
//   });
//   newArticle.save(function(err){
//     if(!err)
//     res.send("Successfully added a new article.");
//   else
//     res.send(err);
//   })
// }
// .delete(function(req,res){
//
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
