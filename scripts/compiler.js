const { readdirSync, mkdirSync, existsSync, lstatSync, copyFileSync} = require('node:fs')

const recursive = (scan, out) => {
    if (lstatSync(scan).isDirectory()) {
        if (!existsSync(out)) {
            mkdirSync(out)
        }
        readdirSync(scan).forEach(child => {
            recursive(`${scan}/${child}`, `${out}/${child}`)
        })
    } else {
        if (!scan.endsWith('.ts') && !scan.endsWith('.json')) {
            if (!existsSync(out)) {
                console.log(`Copying \x1b[34m${scan}\x1b[0m to \x1b[31m${out}\x1b[0m`)
                copyFileSync(scan, out)
            }
        }
    }
}

recursive('src', 'dist')