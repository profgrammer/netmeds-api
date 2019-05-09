const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Employee = require('../models/Employee');
const multer = require('multer');
const fs = require('fs');
const defaultFileName = 'user.jpg';

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
    else cb(null, false);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
});



const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*10
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
    var obj = {};
    obj = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5
    };
    Employee.paginate({}, obj)
    .then(result => {
        if(result){
            console.log(result);
            res.status(200).json({employees: result});
        }
        else{
            res.status(404).json({message: "Not found"});
        }
    })
    .catch(err => {
        res.status(500).json({message: `Error: ${err}`})
    });
});



router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Employee.findById(id).exec()
    .then(result => {
        if(result){
            console.log(result);
            res.status(200).json({employee: result});
        }
        else{
            res.status(404).json({message: "Not found"});
        }
    })
    .catch(err => {
        res.status(500).json({message: `Error: ${err}`})
    });
})

router.post('/', upload.single('profilePhoto'), (req, res, next) => {
    var filename = "";
    if(req.file){
        filename = req.file.filename;
    }
    else filename = defaultFileName;
    var employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        dob: req.body.dob,
        salary: req.body.salary,
        skills: req.body.skills,
        profilePhoto: filename
    });
    employee.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Successful",
            employee: employee
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: `Error: ${err}`
        });
    });
    
});

router.patch('/:id', upload.single('profilePhoto'),(req, res, next) => {
    var ops = req.body;
    if(!req.file) {
        if(req.body.removeDp) {console.log("remove the dp"); ops.profilePhoto = defaultFileName;}
    }
    else ops.profilePhoto = req.file.filename;
    Employee.update({_id: req.params.id}, ops)
    .then(result => {
        console.log(result);
        res.status(200).json({message: "successfully updated"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: `Error: ${err}`});
    })
});

router.get('/search/:name', (req, res, next) => {
    var name = req.params.name;
    console.log(name);
    var page = req.query.page;
    var limit = req.query.limit;
    Employee.find({name: {$regex: ".*" + name + ".*", $options:'i'}}).exec()
    .then(docs => {
        if(docs){
            res.status(200).json(docs);
        }
    })
    .catch(e => res.status(500).json({
        message: `Error: ${err}`
    }));
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Employee.find({_id: id}).exec()
    .then(result => {
        if(result.length == 0){
            res.status(404).json({"message": "not found"})
        }
        else{
            var profilePhoto = result[0].profilePhoto;
            Employee.find({_id: id}).remove().exec()
            .then(result1 => {
                if(result1){
                    if(profilePhoto !== defaultFileName) fs.unlinkSync('uploads/' + profilePhoto);
                    res.status(200).json({message: "Successfully deleted"})
                }
                else{
                    res.status(404).json({message: "Not found"})
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: `Error: ${err}`
                });
            })
        }
    });
});



module.exports = router;