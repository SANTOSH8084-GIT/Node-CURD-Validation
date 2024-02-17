const express = require("express");
const { body, validationResult } = require('express-validator');
const con = require("./config");
const app = express();

app.use(express.json());

//get API
app.get("/getData",(req,resp) => {
    con.query("select name,mobile,pan,email,pincode from users", (error,result) =>{
        if(error){
            resp.json({ Status: 400, Data: error, Message: "Failed" })
        }
        else{
            resp.json({ Status: 200, Data: result, Message: "Success" })
        }
    })
});

//post API
app.post("/postData", [
    //validation start
    body('name')
        .notEmpty().withMessage('Name field is required.')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.')
        .isLength({ min: 10, max: 20 }).withMessage('Name length should be 10 to 20 characters'),
    body('mobile')
        .notEmpty().withMessage('Mobile field is required.')
        .isNumeric().withMessage('Mobile should be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile length should be 10 characters'),
    body('pan')
        .notEmpty().withMessage('PAN field is required.')        
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('PAN should be Alpha numeric')
        .isLength({ min: 10, max: 10 }).withMessage('PAN length should be 10 characters'),
    body('email')
        .notEmpty().withMessage('Email field is required.')
        .isEmail().withMessage('Invalid Email')
        .isLength({ min: 10, max: 30 }).withMessage('Email length should be 10 to 30 characters'),
    body('pincode')
        .notEmpty().withMessage('Pincode field is required.')
        .isNumeric().withMessage('Pincode should be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('Pincode length should be 6 characters')
    ],
    (req,resp) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            resp.json({ Status: 400, Data: errors.array(), Message: "Failed" })
        }
        else{
            const data = req.body;
            con.query('insert into users SET ?', data , (error,result,fields) => {
            if(error) 
            {
                resp.json({ Status: 400, Data: error, Message: "Failed" })
            }
            else{
                resp.json({ Status: 201, Data: result, Message: "Success" })
            }                    
        });
    }
});

//put API
app.put("/updateData/:id",(req,resp) =>{
    const data = [req.body.name,req.body.mobile,req.body.pan,req.body.email,req.body.pincode,req.params.id];
    con.query("update users SET name = ?, mobile = ?, pan = ?, email = ?, pincode = ? where id = ?", data, (error,result,fields) =>{
        if(error) {
            resp.json({ Status: 400, Data: error, Message: "Failed" })
        }
        else{
            resp.json({ Status: 204, Data: result, Message: "Success" })
        }
    })
})

//delete API
app.delete("/deleteData/:id",(req,resp) =>{
    const data = [req.params.id];
    con.query("delete from users where id = ?", data, (error,result,fields) =>{
        if(error)
        {
            resp.json({ Status: 400, Data: error, Message: "Failed" })
        } 
        else{
            resp.json({ Status: 204, Data: result, Message: "Success" })
        }
    })
})

app.listen(5000);
