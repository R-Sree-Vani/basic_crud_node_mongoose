const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const Blog = require("./models/blog");

mongoose.connect("mongodb://localhost/node-tuts",{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then((result)=>app.listen(3000,()=>{
    console.log("Working");
}))
.catch((err)=>console.log(err))

app.set("view engine","ejs");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


app.get("/",(req,res)=>{
    res.redirect("/blogs");
    
})
app.get("/about",(req,res)=>{
    
    res.render("about",{title:"About"});//res.sendFile("./views/about.html",{root: __dirname});
})


//Blog routes

app.get("/blogs",(req,res)=>{
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        res.render("index",{title:"All Blogs",blogs:result})

    })
    .catch((err)=>{
        console.log(err)
    })
    // const blogs= [
    //     {title:'Yoshi finds eggs',snippet:"Loreum ipsum sit amet consectetur"},
    //     {title:'Yoshi finds eggs',snippet:"Loreum ipsum sit amet consectetur"},
    //     {title:'Yoshi finds eggs',snippet:"Loreum ipsum sit amet consectetur"},
    // ];

   // res.render("index",{title:"Home",blogs});

});

app.post("/blogs",(req,res)=>{
    //console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect("/blogs");
    })
    .catch((err)=>{
        console.log(err);
    })

})

app.get("/blogs/create",(req,res)=>{
    res.render("create",{title:"New Blog"});
})


app.get("/blogs/:_id",(req,res)=>{
    const id = req.params._id;
    Blog.findById(id)
    .then((result)=>{
        res.render("details",{blog:result, title: "Blog Details"})
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post("/edit/:_id",(req,res)=>{
    const {_id} = req.params;
    Blog.findById({_id})
    .then((result)=>{
        res.render("edit",{blog:result, title: "Blog Edit"})
    })
    .catch((err)=>{
        console.log(err);
    })

})



app.post("/update/:_id",(req,res)=>{
    const {_id} = req.params;

    Blog.findByIdAndUpdate({_id},{title:req.body.title,snippet:req.body.snippet,body:req.body.body})
    .then((result)=>{
        res.redirect("/blogs")
    })
    .catch((err)=>{
        console.log(err);
    })

    
    // Blog.find({_id},(err,data)=>{
    //     console.log(data)
    // })
    //Blog.updateOne({_id},m)
    
})

app.post("/delete/:_id",(req,res)=>{
    const {_id} = req.params;
    Blog.deleteOne({_id})
    .then((result)=>{
        res.redirect("/blogs")
    })
    .catch((err)=>{
        console.log(err)
    })
    
})
app.use((req,res)=>{
    
    res.render("404",{title:"404"});//res.status(404).sendFile("./views/404.html",{root: __dirname});
})




