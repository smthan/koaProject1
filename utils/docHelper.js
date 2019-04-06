var axios = require('axios')
async function getList(page,cb) {
    var url = 'https://cnodejs.org/api/v1/topics?limit=8&page='+page;
    console.log(url);
    await axios.get(url).then(async res => {
        var docs = [];
        for(d of res.data.data)
        {
            doc = {
                id : d.id,
                author_id : d.author_id,
                tab : d.share,
                title : d.title,
                top : d.top,
                good:d.good,
                reply_count:d.reply_count,
                visit_count:d.visit_count,
                author_name:d.author.loginname,
                author_avatar_url:d.author.avatar_url
            },
            docs.push(doc);
        }
        await cb(docs);
    }).catch(err => {
        console.log(err.message);
    });
}

async function getDoc(id,cb) {
    await axios.get('https://cnodejs.org/api/v1/topic/'+id).then(async res => {
        let d = res.data.data;
        doc = {
            id : d.id,
            author_id : d.author_id,
            tab : d.share,
            title : d.title,
            top : d.top,
            good:d.good,
            reply_count:d.reply_count,
            visit_count:d.visit_count,
            author_name:d.author.loginname,
            author_avatar_url:d.author.avatar_url,
            content:d.content
        };
        await cb(doc);
    }).catch(err => {
        console.log(err.message);
    });
}

module.exports = {
    getList,
    getDoc
}