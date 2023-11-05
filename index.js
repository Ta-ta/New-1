const express = require('express')
const app = express()
const PORT = 3004;
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("postProject")// создали базу данных
const bcrypt = require('bcrypt');// защита пароля
const saltRounds = 10;// ско-ко раз можно его прокрутить

// const cors = require('cors')

// app.use(cors())
app.use(bodyParser.json())

// app.get('/',(req,res)=>{
//       res.send("Hello world")
        
//     })  


app.get('/allUsers',(req,res)=>{
    db.all("SELECT * FROM users",(err, data)=>{
        console.log(data);
        res.json(data)
    })  
})
//_____________________________
// app.get('/allPosts',(req,res)=>{
//     db.all("SELECT * FROM posts",(err, data)=>{
//         console.log(data);
//         res.json(data)
//     })  
// })

// Вывести Данные по постам:
// app.get('/allPosts',(req,res)=>{
//     db.all("SELECT * FROM posts",(err, data)=>{
//         console.log(data);
//         res.json(data)
//     })  
// })
//_____________________________________

//Соединяем данные таблиц
app.get('/allPosts',(req,res)=>{
    db.all("SELECT user_id, text, name FROM posts JOIN users ON users.id=posts.user_id",(err,data)=>{
        res.json(data)

    })
})

// Проверка на присутствие пользователя
app.post('/checkUser',(req,res)=>{
    const{name,password}=req.body

    db.get(`SELECT * FROM users WHERE name='${name}'`, (err,data)=>{
        console.log(data);
        if(data && bcrypt.compareSync(password,data.password)){
            return res.json({id:data.id, name: data.name})
        } 
        return res.sendStatus(401)
    })  
})
//ЗАПОРОЛИТЬ ПАРОЛЬ
app.post('/newUser',(req,res)=>{
    const{name,password}=req.body
    const hash = bcrypt.hashSync(password,saltRounds)
db.run(`INSERT INTO users (name,password) VALUES('${name}','${hash}')`)
db.get(`SELECT id,name FROM users WHERE name='${name}'`,(err,data)=>{
    res.json(data)
})
})


app.delete('/deleteUser', (req,res)=>{
    const {id} = req.body
    db.run(`DELETE FROM users WHERE id=${id}`)
    res.sendStatus(200)
})

app.put('/updateUser',(req,res)=>{
    const{name,id}=req.body
    db.run(`UPDATE users SET name='${name}' WHERE id=${id}`)
    db.get(`SELECT id,name FROM users WHERE id=${id}`,(err,data)=>{
        res.json(data)
    })
})

app.listen (PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})
