const AWS = require('aws-sdk')
const fs = require('fs')
const stream = require('stream')

const s3 = new AWS.S3({
    apiVersion: 'latest',
    region: 'eu-west-2',
    accessKeyId: 'KRU0EXXAUFZJXT4MUII1',
    secretAccessKey: 'IOPEzvP1BKI7Rno1FtM4ejY8eKEIJgDjveo2svCu',
    endpoint: 'https://s3.eu-west-2.wasabisys.com',
})

function UploadLargeFiles(filePath) {
    const pass = new stream.PassThrough()

    const params = {
        Bucket: 'servidorhls',
        Key: filePath,
        Body: pass,
        ContentType: 'video/mp4'
    }

    const options = {
        // 50mb
        partSize: 1024 * 1024 * 50,
        queueSize: 8
    }

    const manager = s3.upload(params, options, function (error, data) {
        if (error) {
            console.log('\x1b[31m', 'File not uploaded', '\x1b[0m')
        } else {
            const uploadedFile = data
            if (uploadedFile && 'Key' in uploadedFile && 'ETag' in uploadedFile) {
                console.log('\x1b[32m', `${filePath} uploaded successfully`, '\x1b[0m')
            } else {
                console.log('\x1b[31m', 'File not uploaded', '\x1b[0m')
            }
        }
    })

    manager.on('httpUploadProgress', (progress) => {
        console.log(`Uploading ${progress.loaded}/${progress.total} Part ${progress.part} ----> ${filePath}`)
    })

    const readStream = fs.createReadStream(filePath)
    readStream.pipe(pass)
}

module.exports = {
    upload: UploadLargeFiles
}