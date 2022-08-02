const express=require("express")
const app=express()
const mysql=require("mysql")
const bodyparser=require("body-parser")
const path=require("path")
const bcrypt=require("bcrypt")
const {DateTime}=require("luxon")
var cookieSession = require('cookie-session')
const { name } = require("ejs")
const authenticationmiddleware=(req,res,next) => {
    if(req.path == "/login" || req.path =="/signup" ){
       next(); 
    }
    else if(req.session.hasOwnProperty("user_id")){
        next();
    }else{
        res.redirect("/login.html")
    }
}



app.set("view engine" ,"ejs")
app.use(express.static("resources"))
app.use(cookieSession({
    name:'session',
    keys: ['j2L4X$1rQs85o$uWU2344AwMHmx22oHWl!@k'],
    maxAge: 24 * 60 * 60 * 1000
  }))

app.use(authenticationmiddleware)
app.use(express.static("privte_resources"))
app.use(bodyparser.urlencoded({extended:true}))

  
const con=mysql.createConnection({

    user:"root",
    password:"password",
    host:"localhost",
    database:"first_db"
    
})

con.connect((err)=>{
    if(err) throw err;
    else console.log("Connected to Mysql successfully")
})



app.get("/",(req,res)=>{

    con.query(`INSERT INTO Users (name,email,password) VALUES('${req.query.name}','${req.query.email}')`,(err,result)=>{
        if (err) res.send("An errorhas occured")
        else  res.send("Hello World")
    })

})

 app.post("/signup",(req,res)=>{
    
    bcrypt.hash(req.body.password,10 , (err,hashed_password)=>{
        if(err) throw err;
        con.query(`INSERT INTO Users (name,email,password) VALUES('${req.body.full_name}','${req.body.email}','${hashed_password}')`,(err,result)=>{
            if (err) res.send("An errorhas occured")
            else  res.send("Sign up Successful")
    })
    
    })
 }) 
 
    app.post("/login",(req,res)=>{
        const email=req.body.email;
        const text_password=req.body.password;
            con.query(`SELECT id, name,password FROM Users WHERE email='${email}'`,(err,results)=>{
                if(err) res.sendStatus(500)
                else{
                   const correct_password=results[0].password;
                   bcrypt.compare(text_password,correct_password,(err,comparison)=>{
                    if(comparison){
                        req.session.user_id=results[0].id
                        req.session.user_name=results[0].name
                        res.redirect("/feed")
                    }
                    else res.sendStatus(401)
                   
                   })
                    
                } 
             })
        


    })

    app.get("/logout",authenticationmiddleware,(req,res)=>{
        req.session = null;
        res.redirect("/login.html")
    })

    app.get("/myprofile",authenticationmiddleware,(req,res)=>{
        if(req.session.hasOwnProperty("user_id")){
            res.render("myprofile.ejs",{
                name:req.session.user_name
            })
        }
    })
    app.get("/feed",authenticationmiddleware,(req,res)=>{
       
        res.render("feed.ejs",{
            name:req.session.user_name,
            user_id:req.session.user_id
           
        })
    })

    app.post("/post/new",authenticationmiddleware,(req,res)=>{
        if(req.body.hasOwnProperty("content") && req.body.content !=""){
            con.query("INSERT INTO Posts (content,user_id) VALUES(?,?)",[req.body.content,req.session.user_id], (err,result)=>{
                if(err) res.sendStatus(500)
                else res.sendStatus(201)
            })
        }
        else res.sendStatus(400)
       
    })

    app.get("/post/all",authenticationmiddleware,(req,res)=>{
        con.query("SELECT Posts.id,Posts.content,Posts.date_posted,Users.name,Users.id AS user_id FROM Posts INNER JOIN Users ON Posts.user_id=Users.id ORDER BY Posts.id DESC ;",(err,result)=>{
           if(err) res.sendStatus(500)
           else{
            const final = result.map(post=>{
                post.date_posted = DateTime.fromJSDate(post.date_posted).toFormat('dd LLL yyyy ')
                return post;
            })
            res.json(final)
           } 
        })
    })

app.listen(3000,()=>{

    console.log("Server is running at port 3000")
})