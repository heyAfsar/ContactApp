const mysql=require('mysql');
const express = require('express');


var app=express();
const bp=require('body-parser');

app.use(bp.json())

var con=mysql.createConnection({
	host:"localhost",
	user:"root",
	database:"myschema"
});

con.connect((err)=>{
	if (!err) {
		console.log("db connection eatablished");
	} else {
		console.log('error connecting to the database'+ JSON.stringify(err, undefined, 2));
	}
});

app.listen(3001,()=>console.log('Express server is running at localhost, port 3001,'));

app.get('/contactapp',(req,res)=>{
	con.query('select * from contactapp',(err, rows, fields)=>{
	if (!err) {
		//console.log(rows)
		res.send(rows)
	} else {
		//console.log(JSON.stringify(err, undefined, 2))
		res.status(500).send('Something broke!\n'+JSON.stringify(err, undefined, 2));
	}	
	})
});

app.post('/contactapp',(req,res)=>{
	var data = req.body;
	console.log(data);
	con.query('insert into contactapp values(?,?)',[data.name,data.phone],(err, rows, fields)=>{
	if (!err) {
		//console.log(rows)
		res.send("Successfully Inserted "+rows.affectedRows+" Records \n For Request : "+JSON.stringify(data))
	} else {
		res.status(500).send('Something broke!\n'+JSON.stringify(err, undefined, 2));
		//console.log(JSON.stringify(err, undefined, 2))
	}	
	})
});

app.delete('/contactapp', (req, res) => {
    var data = req.body;
    console.log(data);
    var st = 'delete from contactapp where  phone in (';


    data.phone.forEach(function(elem) {
        st += " ?,";
    })

    st = st.substr(0, st.length - 1);
    st += ")";


    con.query(st, data.phone, (err, rows, fields) => {
        if (!err) {
            //console.log(rows)
            res.send("Successfully Deleted " + rows.affectedRows + " Records \n For Request : " + JSON.stringify(data))
        } else {
            //console.log(JSON.stringify(err, undefined, 2))
            res.status(500).send('Something broke!\n'+JSON.stringify(err, undefined, 2));
        }
    })
});

app.put('/contactapp', (req, res) => {
    var dd = req.body, data=[];
    console.log(data);

    var st ='UPDATE contactapp SET \
    		name = ?, phone=? \
    		WHERE phone = ?';

    data.push(dd.name, dd.phone, dd.oldPhone);

    con.query(st, data, (err, rows, fields) => {
        if (!err) {
            //console.log(rows)
            res.send("Successfully Updated " + rows.affectedRows + " Records\n For Request : "+ JSON.stringify(data))
        } else {
            //console.log(JSON.stringify(err, undefined, 2))
            res.status(500).send('Something broke!\n'+JSON.stringify(err, undefined, 2));
        }
    })
});