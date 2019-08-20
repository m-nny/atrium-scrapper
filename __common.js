const fs = require('fs');

function readJson(filename) {
    return JSON.parse(fs.readFileSync(filename))
}

function writeJson(filename, data) {
    return fs.writeFileSync(filename, JSON.stringify(data));
}

function writeTsv(filename, data, header) {
    if (!(data instanceof Array)) {
        throw new Error("data must be array");
    }
    const collapsed = (header + '\n') + data.map(([id, value]) => `${id}\t${escapeSpaces(value)}`).join('\n');
    return fs.writeFileSync(filename, collapsed);
}

function escapeSpaces(s) {
    return s
        .replace(/\n+/gi, '\t')
        .replace(/\t+/gi, ',')
        .replace(/\ +/gi, '\ ')
}

function getSourcePost(post) {
    return post.copy_history && post.copy_history.length > 0 ? post.copy_history[0] : null;
}

function getText(post) {
    return post.text;
}

function getFirstPhoto(post) {
    // console.log(post);
    if (!post.attachments)
        return null;
    const photos = post.attachments.filter(attach => (
        attach.type === 'photo' || attach.type === 'posted_photo'
    ));
    return photos.length > 0 ? photos[0] : null;
}

function getFirstPhotoOfSourcePost(post) {
    const source = getSourcePost(post);
    if (!source)
        return undefined;
    return getFirstPhoto(source);
}

module.exports = {
    readJson,
    writeJson,
    getSourcePost,
    getFirstPhoto,
    getFirstPhotoOfSourcePost,
    getText,
    writeTsv,
}