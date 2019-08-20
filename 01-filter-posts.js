const fs = require('fs');

function readJson(filename) {
    return JSON.parse(fs.readFileSync(filename))
}

function writeJson(filename, data) {
    return fs.writeFileSync(filename, JSON.stringify(data));
}

function getSourcePost(post) {
    return post.copy_history && post.copy_history.length > 0 ? post.copy_history[0] : null;
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

const N = 100 * 1000;
const input = `./data/all_posts.${N}.min.json`;
const output = `./data/resposts.${N}.min.json`;
const posts = readJson(input).items;

const resposts = posts.filter(p => getFirstPhotoOfSourcePost(p));
console.log(`found ${resposts.length} reposts with photo`);
writeJson(output, resposts);