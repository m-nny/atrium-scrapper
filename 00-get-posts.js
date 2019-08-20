require('dotenv-safe').config();
const easyvk = require('easyvk');
const { writeJson } = require('./__common');

const {
    LOGIN,
    PASSWORD,
} = process.env;

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function get_posts(vk, n, owner_id) {
    const promises = [];
    let total_count, left, offset = 0, max_count = 100;

    const { vkr: sub_wall } = await vk.call('wall.get', {
        count: 1,
        owner_id
    });

    total_count = sub_wall.count;
    left = Math.min(total_count, n);
    console.log(`Loading ${n}. Total ${total_count}`);

    while (offset < left) {
        promises.push(vk.call('wall.get', {
            offset,
            count: max_count,
            owner_id,
        }).then(({ vkr }) => {
            console.log(`[${vkr.queryData.offset}/${left}]`)
            // console.log(vkr);
            // console.log(`+=${vkr.items.length}`);
            return vkr;
        }));
        offset += max_count;
        await sleep(1);
    }
    let wall = await Promise.all(promises);
    return {
        count: total_count,
        items: wall.flatMap(w => w.items)
    };
}

async function get_posts_seq(vk, n, owner_id) {
    let total_count, left, offset = 0, max_count = 100;

    const { vkr: sub_wall } = await vk.call('wall.get', {
        count: 1,
        owner_id
    });

    total_count = sub_wall.count;
    left = Math.min(total_count, n);
    console.log(`Loading ${n}. Total ${total_count}`);

    const wall = [];
    while (offset < left) {
        const sub_wall = await vk.call('wall.get', {
            offset,
            count: max_count,
            owner_id,
        }).then(({ vkr }) => {
            console.log(`[${vkr.queryData.offset}/${left}]`)
            // console.log(vkr);
            // console.log(`+=${vkr.items.length}`);
            return vkr;
        });
        wall.push(sub_wall);
        offset += max_count;
    }
    return {
        count: total_count,
        items: wall.flatMap(w => w.items)
    };
}

easyvk({
    username: LOGIN,
    password: PASSWORD,
    session_file: __dirname + '/.my-session'
}).then(async vk => {

    let { vkr: groups } = await vk.call('groups.get', {
        extended: true
    });
    // console.log(groups);
    groups = groups.items.filter(g =>
        g.name.includes('VΛ') || g.screen_name.includes('vatriume')
    );
    if (groups.length == 0) {
        console.log('Cannot find VA');
        process.exit(1);
    }
    const atrium_id = groups[0].id;
    console.log(`Identified target as [${groups[0].id}]${groups[0].screen_name}`);

    const first_n = 100 * 1000;

    const wall = await get_posts_seq(vk, first_n, -atrium_id);

    // const with_photos = wall.items.filter(hasPhotoAttachment);

    // console.log(with_photos);
    // console.log(`[${with_photos.length}/${wall.items.length}/${wall.count}]`);

    writeJson(`./data/all_posts.${first_n}.min.json`, wall);
});