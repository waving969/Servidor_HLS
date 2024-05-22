const hashName = require('./hashName')

const CDNS = [
    'localhost'
]

function getRandomCdn() {
    return CDNS[Math.floor(Math.random() * CDNS.length)]
}

function generateSecurePathHash(expires, client_ip) {
    return hashName(`${expires} ${client_ip}`, true)
}

function getUrl() {
    const videoId = hashName(process.argv[2])
    const ip = process.argv[3]
    const expires = String(Math.round(new Date(Date.now()
        + (1000 * 60 * 60)).getTime() / 1000)) // 1 Hour expires
    const token = generateSecurePathHash(expires, ip)
    const qualities = process.argv[4].split(',').map(quality => {
        return quality.slice(0, -1)
    }).join(',')

    return `http://${getRandomCdn()}/hls/vod/${videoId}/${token}/${expires}/_,${qualities},0p.mp4.play/master.m3u8`
}

console.log(getUrl())