const { readJson, writeJson, getFirstPhotoOfSourcePost } = require('./__common');

const N = 100 * 1000;
const MAX_REPOST_CNT = N; //30;
const input = `./data/all_posts.${N}.min.json`;
const posts = readJson(input).items;

const resposts = posts.filter(p => getFirstPhotoOfSourcePost(p)).slice(0, MAX_REPOST_CNT);

console.log(`found ${resposts.length} reposts with photo`);

const output = `./data/resposts.${resposts.length}.${N}.min.json`;
writeJson(output, resposts);