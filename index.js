var express = require('express');
var app = express();
var session = require('express-session')
var bodyparser = require('body-parser');
var multer = require('multer');
var upload = multer();


app.use(session({secret:'abcs'
,name:'1234'
,saveUninitialized:false}))

app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: true })); 


app.use(upload.array()); 
app.use(express.static('public'));

app.set('view engine','ejs');

var {MongoClient}= require('mongodb');
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

// const recordRoutes = express.Router();

app.get('/',function(req,res){
    
    res.render('form1');
    
});
app.get('/form2',function(req,res){
   
    res.render('form2');
});
async function mydb(data){
    await client.connect();
    const database =  await client.db("logindetails");
    const table = database.collection("logininfo");
    const result = await table.insertOne(data);
    return table;
    client.close(); 
}

app.post('/',function(req,res){
    
    try{
       mydb(req.body);
       res.send("data inserted");
    }
    catch{
       res.send("something went wrong");
    }
       
   })
   
app.post("/submit1",async (req,res)=>{
    try{
        // console.log(req.body);
        await client.connect();
        const database =  await client.db("logindetails");
        const table = await database.collection("logininfo");
        const data = await table.find(req.body).toArray();
        if (Array.isArray(data) && data.length > 0){
            req.session.isLoggedIn = true;
            res.redirect('/profile');
        };
        
     }
     catch{
        res.send("something went wrong");
     }
     client.close();
})


app.get('/profile',(req,res)=>{
    if(req.session.isLoggedIn){
    res.send("login done ....");
    }else{
        res.redirect('/');
    }
})

app.get('/logout',(req,res)=>
{
req.session.destroy((err)=>{})
res.send('Thank you! Visit again')
})

// recordRoutes.route("/submit1").get(async function (req, res) {
//     const dbConnect = dbo.mydb();
  
//     dbConnect
//       .collection("logininfo")
//       .find({})
//       .toArray(function (err, result) {
//         if (err) {
//           res.status(400).send("Error fetching listings!");
//        } else {
//           console.res.json(result);
//         }
//       });
//   });
// var Person = mongoose.model("Person", personSchema);

// app.get('/people', function(req, res){
//    Person.find(function(err, response){
//       res.json(response);
//    });
// });

// app.post('/',async function(req,res){
//     var coll = await db();
//     var data = await coll.insertOne(req.body);
//     console.log(req.body);
//     client.close();
    
// });

// app.post('/submit1',async function(req,res){
//     var coll = await db();
//     var data = await coll.find(req.body);
//     var data1 = await coll.find(req.body);
//     if()
//     console.log(req.body);
//     client.close();
    
// });

app.listen(8000);