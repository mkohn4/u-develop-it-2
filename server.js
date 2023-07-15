const express = require('express');
const mysql= require('mysql2');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//connect to mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password: 'salesforce1',
        database: 'election'
    },
    console.log('Connected to the election database')
);

//First db query
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

//GET a single candidate
app.get('/api/candidate:id', (req,res) => {
    const sql = `SELECT * FROM candidates WHERE id=?`;
    const params = [req.params.id];

    db.query(sql, params, (err,row) => {
        if (err) {
            console.log(err);
            res.status(400).json({error:err.message});
            return;
        }
        console.log(row);
        res.json({
            message: 'success',
            data: row
        });
    });
});


//GET all candidates
app.get('/api/candidates', (req,res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql,(err,rows) => {
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
        res.json({
            message: 'success1',
            data: rows
        });
    });
});

//DELETE a candidate API route
app.delete('/api/candidate/:id', (req,res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,result) => {
        if (err) {
            console.log(err);
            res.statusMessage(400).json({error: res.message});
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            console.log(result);
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }

    });
})
//Delete a candidate direct DB query
db.query(`DELETE FROM candidates WHERE id=?`, 1, (err,result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

//CREATE a candidate with the DB
const sql= `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES(?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

//CREATE candidate with the API routes
app.post('/api/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {s
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//404 error for all non-defined responses
app.use((req,res) => {
    res.status(404).end();
});

//start express middleware
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})