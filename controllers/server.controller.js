const fs = require("fs");
const path = require("path");

// Also try easy-templates-x and docx-templates (and officeparser to parse...)

// Create a test directory
exports.testDir = (req, res) => {
        console.log("Test directory in server routes?!");
        //Create folder
        fs.mkdir("C:\\Users\\jonri\\Documents\\Work\\test", {}, (err) => {
            if (err) throw err;
            console.log("folder created ...");
        });
        res.json({ message: "Test directory in server routes?!" });
    };

    
// Create a test directory
exports.createSDF = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }
    
    console.log(`Create SDF for ${req.body.submittalID}:`);
    console.log(JSON.stringify(req.body));
    
    // console.log(req.body);

    const { createReport } = require('docx-templates');
    
    const template = fs.readFileSync('C:\\Users\\jonri\\Documents\\Work\\test\\SDF Template.docx');
        
    const buffer = await createReport({
        template,
        data: req.body,
        cmdDelimiter: ['{', '}']
    });
    
    fs.writeFileSync(`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.docx`, buffer)
};

exports.createPDF = async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }
    
    console.log(`Create SDF for ${req.body.submittalID}:`);
    console.log(JSON.stringify(req.body));
    
    // console.log(req.body);

    var docxConverter = require('docx-pdf');

    docxConverter(`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.docx`,`C:\\Users\\jonri\\Documents\\Work\\test\\${req.body.submittalID}-SDF.pdf`, function(err, result) {
        if(err){
            console.log(err);
        }
        console.log('result'+result);
    });
};