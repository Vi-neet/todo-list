import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Todo from './models/Todo.js';
import User from './models/User.js';


const secret= 'secret123';

await mongoose.connect('mongodb://localhost:27017/auth-todo',{useNewUrlParser:true, useUnifiedTopology:true});
const db= mongoose.connection;
db.on('error', console.log);

const app= express();
app.use(cookieParser());
app.use(bodyParser.json({extended:true}));
app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000',
}));



app.get('/',(req,res) => {
  res.send('ok');
});

app.get('/user', (req, res) => {
  if (!req.cookies.token) {
      return res.json({});
   }
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id)
    .then(userInfo => {
      if (!userInfo) {
        return res.json({});
      }
      res.json({id:userInfo._id,email:userInfo.email});
    });

});

app.post('/register', (req,res)=>{
const {email,password}=req.body;
const saltRounds= 10;
const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const user= new User({password:hashedPassword,email});
  user.save().then(userInfo =>{
    jwt.sign({id:userInfo._id,email:userInfo.email}, secret, (err,token) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
      }
    });
  });
});


app.post('/login', (req, res) => {
  const {email,password} = req.body;
  User.findOne({email})
    .then(userInfo => {
      if (!userInfo) {
        return res.json({});
      }
      const passOk = bcrypt.compareSync(password, userInfo.password);
      if (passOk) {
        jwt.sign({id:userInfo._id,email},secret, (err,token) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').send();
});

app.get('/todos', async (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.token, secret);
    const todos = await Todo.find({ user: new mongoose.Types.ObjectId(payload.id) });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/todos', (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const todo= new Todo({
    text:req.body.text,
    done:false,
    user:new mongoose.Types.ObjectId(payload.id),
  })
  todo.save().then(todo => {
    res.json(todo);
  })
});

app.post('/todos', (req,res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Todo.updateOne({
    _id:new mongoose.Types.ObjectId(req.body.id),
    user:new mongoose.Types.ObjectId(payload.id)
  }, {
    done:req.body.done,
  }).then(() => {
    res.sendStatus(200);
  });
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const payload = jwt.verify(req.cookies.token, secret);
    const todo = await Todo.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(payload.id),
    });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(4000);

