
// Add express module
var express=require('express');
// Create Express application
var app=express();
// Add MySql module
var mysql=require('mysql');
// Add body-parser,\
var bodyParser = require('body-parser');
// for parsing application/json and forms data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// Add file systm module, to serve html and css files
var fs=require('fs');
// MySql connection config
var config={
    server: 'localhost',
    port: 3306,
    database: 'api',
    user: 'admin',
    password: 'admin'
};
// Create connection pool
var pool=mysql.createPool(config);
// serve user registration htmls and styles css file
app.get('/register_user',function(req,res){
    fs.readFile(__dirname+'/register_user.html',function(err,data){
        console.log(data);
        res.end(data);
    });

});
app.get('/styles.css',function(req,res){
    fs.readFile(__dirname+'/styles.css',function(err,data){
        console.log(data);
        res.end(data);
    });

});
// Handle register call to insert html forms data to mysql table
app.post('/register',function(req,res){
    console.log(req.body);
    pool.query("insert into users set ?",req.body,function(err,result){
        if(err){
            console.log(err);
            throw err;
        }
        console.log(result);
    });
    res.redirect('/listusers');
});
// Create dynamic html content with sql query
app.get('/listusers',function(req,res){
    pool.query('select * from users',function(err,rows){
        console.log(rows);
        res.writeHead(200,{"content-type":"text/html"});
        res.write("<h1 style='color:green;text-align:center'>User List</h1>")
        res.write("<hr>");
        res.write("<div style='width:100%'>");
        res.write("<div style='display:inline-block;width:50%;font-size:2em;color:blue'>Name</div><div style='display:inline-block;width:50%;font-size:2em;color:blue'>E-mail</div>")
        for(row of rows){
            console.log(row);
            res.write("<div style='display:inline-block;width:50%'>"+row["name"]+"</div><div style='display:inline-block;width:50%'>"+row["email"]+"</div>");
        }
        res.write("</div>");
        res.end();
    })
});

// API implementation. This deals with only providing necessary data in JSON format
// Get list of all users
app.get('/users',function(req,res){
    pool.query('select * from users',function(err,rows){
        console.log(rows);
        res.writeHead(200,{'content-type':'application/json'});
        res.write(JSON.stringify(rows));
        res.end();
    })
});

app.get('/users/:id',function(req,res){
    pool.query('select * from users where id=?',req.params.id,function(err,rows){
        console.log(rows);
        res.writeHead(200,{'content-type':'application/json'});
        res.write(JSON.stringify(rows));
        res.end();
    })
});

// Add a new user
app.post('/users',function(req,res){
    pool.query('insert into users set ?',req.body,function(err,rows){
        if(err){
            console.log(err);
            throw err;
        }
        res.writeHead(201,{'content-type':'application/json'});
        res.write(JSON.stringify(rows));
        res.end();
        //res.end(results.json);
    })
});
// Delete a user
app.delete('/users/:id',function(req,res){
    pool.query('delete from users where id=?',req.params.id,function(err,rows){
        console.log(req.params.id);
        if(err){
            console.log(err);
            throw err;
        }
        res.writeHead(203,{'content-type':'application/json'});
        res.write(JSON.stringify(rows));
        res.end();
    })
});

// Update a user
app.put('/users/:id',function(req,res){
    pool.query('update users set ? where id=?',[req.body,req.params.id],function(err,rows){
        console.log(req.params.id);
        if(err){
            console.log(err);
            throw err;
        }
        res.writeHead(203,{'content-type':'application/json'});
        res.write(JSON.stringify(rows));
        res.end();
    })
});

// Dynamic page implementation
app.get("/userlist.html", function(req,res){
    fs.readFile(__dirname+'/userlist.html',function(err,data){
        console.log(data);
        res.end(data);
    });

});

app.listen(8090);   