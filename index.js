const soundpack = process.argv[2];
const execa = require('execa')
const { join } = require('path')
const fs = require('fs')
let config = require(`./${soundpack}/config.json`);
const defines = config['defines'];

async function extract(key) {
    if (defines[key]) {
        const startTime = defines[key][0] / 1000;
        const duration = defines[key][1] / 1000;
        console.log(`Extracting ${key}: start=${startTime}s, duration=${duration}s`);
        const outputExt = 'mp3';
        const outputPath = join(process.cwd(), soundpack, `${key}.${outputExt}`);
        try {
            await execa('ffmpeg', [
                '-y', // Overwrite output files without asking
                '-ss', startTime.toString(),
                '-i', join(process.cwd(), soundpack, config['sound']),
                '-t', duration.toString(),
                '-vn', // No video
                '-acodec', 'libmp3lame',
                outputPath
            ]);
        } catch (err) {
            console.error(`Error extracting ${key}:`, err);
        }
        }
    }

    (async () => {
    const outputExt = 'mp3';
    for (const key in defines) {
        await extract(key);
        config['defines'][key] = `${key}.${outputExt}`;
    }
    config['key_define_type'] = 'multiple';
    let data = JSON.stringify(config, null, 4);
    fs.writeFileSync(join(process.cwd(), soundpack, 'config.json'), data);
    console.log(config);
})();
