const express = require('express');
const app=express();
const bodyParser=require('body-parser');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));//data through body-parser
app.use(bodyParser.json());//data interms of json
app.use(express.static('public'));//static files
const MongoClient=require('mongodb').MongoClient;

var db
var s

MongoClient.connect('mongodb://localhost:27017/Pantaloons',{useUnifiedTopology:true},
(err,database)=>
{
    if(err) return console.log(err)
    db=database.db('Pantaloons')
    app.listen(1000,()=>
    {
        console.log('Listening on 1000')
    })
})
/*
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static('public'))
*/

/*For Accessing Home page*/
app.get('/',(req,res)=>{
    db.collection('Women').find().toArray((err,result)=>{
        if(err) return console.log(err)
        console.log("In home page :)");
        res.render('home.ejs',{data:result})
   //render loading a page
    })
})

/*Add Stock Details Page*/
app.get('/add',(req,res)=>{
    console.log("In Add Stock Details Page")
    res.render('add.ejs')
});

/*Add Stock Details - action from page*/
app.post('/AD',(req,res)=>{
    var dt=new Date().toISOString().slice(0, 10);
    console.log(dt);
    var whole={
        Date:dt,
        Pid:req.body.Pid, Brand:req.body.Brand ,
        Category:req.body.Category ,Name:req.body.Name,
        Size:req.body.Size,Quantity:req.body.Quantity,
        CP:req.body.CP,SP:req.body.SP
    }
    db.collection('Women').insertOne(whole,(err,result)=>{
        if(err) return console.log(err)
        console.log('Added Details to database')
        res.redirect('/')
    })
    });

/*Displaying Sales Details*/
app.get('/display',(req,res)=>{
    db.collection('Women').find().toArray((err,result)=>{
        if(err) return console.log(err)
        console.log("Displayed Sales Details")
        res.render('display.ejs',{data:result})
})
})

/*Update Stock Details - page*/
app.get('/update',(req,res)=>{
    console.log("In Update Stock Details Page")
    res.render('update.ejs')
})

/*Update Stock Details - action from page - From Navigation Bar*/
app.post('/UD',(req,res)=>{
    var du=new Date().toISOString().slice(0, 10);
    db.collection('Women')
    .findOneAndUpdate({Pid:req.body.Pid,Brand:req.body.Brand,
    Category:req.body.Category,Name:req.body.Name,},{
        $set:{
            Date:du,
            Quantity:req.body.Quantity
        }
    },
    {sort: {_id:-1}
     },
    (err,result)=>{
        if(err) return console.log(err)
        console.log('Updated the database - Nav Bar')
        res.redirect('/')
    })
    })

/*Update Stock Details - action from page - From Edit Button*/
app.post('/u',(req,res)=>{
    var result=[]
    result.push(req.body.id);
    result.push(req.body.brand);
    result.push(req.body.cat);
    result.push(req.body.nm);
    result.push(req.body.size);
    result.push(req.body.qty);
    result.push(req.body.cp);
    result.push(req.body.sp);
    console.log('Updated Database - Edit Button - to EJS Page')
    //console.log(result);
    res.render('update1.ejs',{data:result})
    })

/*Update Stock Details - action from update1.ejs page After clicking edit- bY post*/
app.post('/pu1',(req,res)=>{
    //var ub=new Date().toISOString().slice(0, 10);
    db.collection('Women')
    .findOneAndUpdate({Pid:req.body.id},{
        $set:{
            //Date:ub,
            Quantity:req.body.Quantity,
            CP:req.body.CP,
            SP:req.body.SP
        }
    },
    {sort: {_id:-1}
     },
    (err,result)=>{
        if(err) return console.log(err)
        console.log('Updated database - Edit Button')
        res.redirect('/')
    })
    })

/*Delete Stock Details - page*/
    app.get('/delete',(req,res)=>{
        console.log("In Delete Stock Details Page")
        res.render('delete.ejs')
    })

/*Delete Stock Details - action from page - From Navigation Bar*/
    app.post('/DD', (req, res) => {
        db.collection('Women').
        findOneAndDelete({Pid:req.body.Pid}, (err, result) => {
            if(err) return console.log(err)
            console.log('Document deleted - Nav Bar')
            res.redirect('/')
          })
        })

/*Delete Stock Details - action from page - From Delete Button*/
app.post('/d', (req, res) => {
    db.collection('Women').
    findOneAndDelete({Pid:req.body.pid}, (err, result) => {
        if(err) return console.log(err)
        console.log('Document deleted - Delete Button')
        //console.log(req.body.pid);
        res.redirect('/')
      })
    })

