import 'dotenv/config'
import fs from 'fs';

const headers= {
    "accept": "application/json",
    "accept-language": "en",
    "content-type": "application/json",
    "cookie": process.env.YUQUE_COOKIE,
}
const BASE_URL = process.env.YUQUE_BASE_URL || 'https://www.yuque.com';
if(!process.env.YUQUE_BOOK_ID || !process.env.YUQUE_COOKIE) {
    throw Error('no YUQUE_BOOK_ID and YUQUE_COOKIE')
}
function formatTitle(title){
    return title.replace(/[^A-Za-z0-9\u4e00-\u9fa5]+/g, '_').toLowerCase();

}
async function run() {
    const docs = await fetch(`${BASE_URL}/api/docs?book_id=${process.env.YUQUE_BOOK_ID}`, {
        "headers": headers,
        "body": null,
        "method": "GET"
    }).then(res=>res.json());
    docs.data.map(doc=>{
        doc._local_title = formatTitle(doc.title);
        return doc;
    })
    fs.writeFileSync(`./public/docs/doc.json`, JSON.stringify(docs.data))
    const books = docs.data;
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const doc = await fetch(`${BASE_URL}/api/docs/${book.slug}?include_contributors=false&include_like=false&include_hits=false&merge_dynamic_data=true&book_id=${book.book_id}`, {
            "headers": headers,
            "body": null,
            "method": "GET"
        }).then(res=>res.json());
        fs.writeFileSync(`./public/docs/${book.id}.json`, JSON.stringify(doc))
    }
};
run();