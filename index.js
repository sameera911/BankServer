
const express=require('express');
const dataService=require('./services/data.service');
const session=require('express-session');

const app=express();

app.use(express.json());

app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
}))

//middleware
// app.use((req,res,next)=>{
// console.log(req.body);
// next();
// });

const logMiddleware=(req,res,next)=>{
    console.log(req.body);
    next()
}
app.use(logMiddleware);

const authMiddleware=(req,res,next)=>{
    if(!req.session.currentuser)
    {
        return res.json({
            status: true,
            statusCode: 401,
            message: "Please log in"
            } )
    }
    else{
        next()
    }
}

app.get('/',(req,res)=>{
    res.send("GET METHOD");
});

app.post('/',(req,res)=>{
    res.send("POST METHOD");
});


app.post('/register',(req,res)=>{
   // console.log(req.body);
   const result= dataService.register(req.body.acno,req.body.name,req.body.password);
   //res.status(result.statusCode);
    console.log(res.status(result.statusCode).json(result)); 
});

app.post('/login',(req,res)=>{
   // console.log(req.body);
   const result= dataService.login(req,req.body.acno,req.body.password);
  // res.status(result.statusCode);
    console.log(res.status(result.statusCode).json(result)); 
});

app.post('/deposit',authMiddleware,(req,res)=>{
   // console.log(req.session.currentuser);
   const result= dataService.deposit(req.body.accno,req.body.pass,req.body.amount);
//   res.status(result.statusCode);
//    console.log(res.json(result)); 
   console.log(res.status(result.statusCode).json(result)); 
});

app.post('/withdraw',authMiddleware,(req,res)=>{
    //console.log(req.body);
   const result= dataService.withdraw(req.body.accno,req.body.pass,req.body.amount);
//    res.status(result.statusCode);
//     console.log(res.json(result)); 
    console.log(res.status(result.statusCode).json(result)); 
});

app.put('/',(req,res)=>{
    res.send("PUT METHOD");
});
app.patch('/',(req,res)=>{
    res.send("PATCH METHOD");
});
app.delete('/',(req,res)=>{
    res.send("DELETE METHOD");
});

app.listen(3000,()=>{
    console.log("server started at port 3000");
});
