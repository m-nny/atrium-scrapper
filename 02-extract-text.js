const { readJson, getText, getSourcePost, writeTsv } = require('./__common');

const N = 30;
const input = `./data/resposts.${N}.100000.min.json`;
const output = `./data/reposts.${N}.tsv`;
const reposts = readJson(input);
const sourceTexts = reposts.map(p => [p.id, getText(getSourcePost(p)) || getText(p)]);
// console.log(texts);
console.log(sourceTexts.length);
writeTsv(output, sourceTexts, 'id\ttext');