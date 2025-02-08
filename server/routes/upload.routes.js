const multer = require('multer');
const {format} = require('util');
const {join} = require("path");
const {Storage} = require('@google-cloud/storage');
const usersController = require('../controllers/user.controller');

const multerMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

// Create a new instance of Google Cloud Storage
const storage = new Storage({
    projectId: 'leafy-unity-389117',
    keyFilename: join(__dirname, '../leafy-unity-389117-9e27b9145352.json')
});

storage.getBuckets().then(x => console.log(x));
const bucket = storage.bucket('bucket-easystep-connect')

module.exports = app => {

    var router = require("express").Router();

    router.post('/', multerMiddleware.array('file', 10), (req, res, next) => {
        console.log(req.files);
        console.log(req.body);
        if (!req.files || req.files.length === 0) {
            res.status(400).send('No files uploaded.');
            return;
        }
        const userId = req.body.userId;

        const promises = req.files.map(file => {
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err) => {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            });

            blobStream.on('finish', async () => {
                const publicUrls = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

                // Update the user's PDF file URL using the controller method
                usersController.updatePdfFilesUrlById(userId, [publicUrls], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Internal Server Error");
                    }
                });
            });

            blobStream.end(file.buffer);
        });

        Promise.all(promises)
            .then(() => res.status(200).send("Files uploaded successfully"))
            .catch((err) => {
                console.error(err);
                res.status(500).send("Internal Server Error");
            });
    })
    router.delete('/delete-file', (req, res) => {
        const { userId, pdfUrl } = req.body;
        console.log(`TO BE deleted file from user: ${userId}, url: ${pdfUrl}`);

        // parse the pdfUrl to get the file name
        const fileName = pdfUrl.split('https://storage.googleapis.com/' + bucket.name + '/')[1];
        console.log(`Parsed filename: ${fileName}`);

        // delete the file in the bucket
        const file = bucket.file(fileName);
        file.delete()
            .then(() => {
                console.log(`gs://${bucket.name}/${fileName} deleted.`);

                // remove the pdfUrl in the user's record in the database
                usersController.deletePdfFilesUrlById(userId, pdfUrl, (err, data) => {
                    if (err) {
                        console.error('ERROR deleting URL from database:', err);
                        return res.status(500).send("Internal Server Error");
                    } else {
                        console.log('File URL successfully deleted from database');

                        return res.status(200).send("File deleted successfully");
                    }
                });
            })
            .catch(err => {
                console.error('ERROR deleting file from bucket:', err);
                return res.status(500).send("Internal Server Error");
            });
    });


    router.post('/profile-image', multerMiddleware.single('image'), (req, res, next) => {
        console.log(req.file);
        console.log(req.body);
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }
        const userId = req.body.userId;

        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        });

        blobStream.on('finish', async () => {
            const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

            // Update the user's Profile image URL using the controller method
            usersController.updateProfileImageUrlById(userId, publicUrl, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Internal Server Error");
                }
            });
            res.status(200).send("Image uploaded successfully");
        });

        blobStream.end(req.file.buffer);
    })

   app.use('/upload', router);
};
