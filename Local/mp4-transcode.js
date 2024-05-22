const ffmpegStatic = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')
const aws = require('./aws')
const hashName = require('./hashName')


ffmpeg.setFfmpegPath(ffmpegStatic)

const qualities = [
    {
        w: 842,
        h: 480,
        vbr: 1400,
        abr: 128
    },
    {
        w: 1280,
        h: 720,
        vbr: 2800,
        abr: 160
    },
    {
        w: 1920,
        h: 1080,
        vbr: 5000,
        abr: 192
    }
]

const outputOptions = qualities.map(q => {
    return [
        `-c:v h264`,
        '-profile:v main',
        '-c:a aac',
        '-ac 2',
        '-map 0:v',
        '-map 0:a',
        '-sn',
        `-vf scale=${q.w}:${q.h}`,
        '-pix_fmt yuv420p',
        `-b:a ${q.abr}k`,
        `-maxrate ${q.vbr}k`,
        `-bufsize ${q.vbr}k`,
        `-crf 24`
    ]
})

const makeDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

const transcode = async (
    filePath
) => {
    makeDir('vod')
    const fileName = path.parse(filePath).name
    const videoName = hashName(fileName)

    const mp4Dir = `vod/${videoName}`
    makeDir(mp4Dir)

    ffmpeg.ffprobe((filePath), function (err, data) {
        const meta = data.streams.find(item => item.codec_type === 'video')

        var maxQuality = 3
        if (meta.height < 1080 && meta.height >= 720) {
            maxQuality = 2
        } else if (meta.height < 720 && meta.height >= 480) {
            maxQuality = 1
        } else if (meta.height < 480) {
            maxQuality = 1
        }

        for (var i = 0; i < maxQuality; i++) {
            const q = qualities[i]
            const outputFile = `${mp4Dir}/_${q.h}p.mp4`
            var __outputOptions = [...outputOptions[i]]

            ffmpeg(filePath)
                .output(outputFile)
                .outputOptions(__outputOptions)
                .on('start', function (command) {
                    console.log(command)
                })
                .on('progress', function (progress) {
                    console.log(`Processing ${outputFile} --> ${parseFloat(progress.percent).toFixed(2)}%`)
                })
                .on('error', function (err, stdout, stderr) {
                    console.log(`Cannot process video: ${outputFile} --> ${err.message}`)
                }).on('end', function (stdout, stderr) {
                    console.log(`${outputFile} processed successfully`)
                    aws.upload(outputFile)
                }).run()
        }
    })
}

transcode(process.argv[2])