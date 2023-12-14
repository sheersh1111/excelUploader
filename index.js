const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const async = require('async');
const mongoose = require('mongoose');
const cors = require('cors');


// const corsOptions = {
//     origin: 'http://localhost:3000',
//   };

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });
const mongoURI = "mongodb://localhost:27017/Ecommerce";

// Define schema for MongoDB
const mySchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
    dob: Number,
    workExp: String,
    resume: String,
    currentLocation: String,
    PostalAddress: String,
    currentEmployer: String,
    currentDesignation: String
});

// Define model for MongoDB
const MyModel = mongoose.model('MyModel', mySchema);

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("db connected successfully")
});
// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    
    // console.log("data:", data)
        const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
        async.eachSeries(data,function(item,callback){
            MyModel.create({
                name: Object.values(item)[0],
                email: Object.values(item)[1],
                mobile: Object.values(item)[2],
                dob: Object.values(item)[3],
                workExp: Object.values(item)[4],
                resume: Object.values(item)[5],
                currentLocation: Object.values(item)[6],
                PostalAddress: Object.values(item)[7],
                currentEmployer: Object.values(item)[8],
                currentDesignation: Object.values(item)[9]
            });
            callback();
        },function(err){
            if(err){
                res.json({
                    success:false
                })
            }else{
                res.json({
                    success:true
                })
            }
        })
});

app.listen(4000, () => {
    console.log('Server started on port 4000');
});
