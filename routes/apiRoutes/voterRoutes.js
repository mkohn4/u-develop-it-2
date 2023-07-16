const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//Get all Voters
router.get('/voters', (req,res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err,rows) => {
        if (err) {
            res.status(500).json({error: err.message})
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//get a single voter by id
router.get('/voter:id', (req,res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,row) => {
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Create a Voter
router.post('/voter', (req,res) => {
    const errors = inputCheck(req.body, 'first_name','last_name','email');
    if (errors) {
        res.status(400).json({error:errors});
        return;
    }
    const sql = `INSERT INTO voters (first_name, last_name, email)
                VALUES (?,?,?)`;
    const params = [req.body.first_name, req.body.last_name, req.body.email];

    db.query(sql, params, (err,result) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            message:'success',
            data: body
        });
    });
});

//update a voter
router.put('/voter:id', (req,res) => {
    //data validation
    const errors = inputCheck(req.body,'email');
    if (errors) {
        res.status(400).json({error:errors});
        return;
    }

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err,result) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'voter not found'
            });
        } else {
            res.json({
                message:'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//delete a voter
router.delete('/voter:id', (req,res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;

    db.query(sql, req.params.id, (err,result) => {
        if (err) {
            res.status(500).json({error:err.message});
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'voter not found'
            });
        } else {
            res.json({
                message: 'success',
                data: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;