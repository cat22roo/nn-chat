'use strict';
const pug = require('pug');
const Post = require('./post');
const util = require('./handler-util');

async function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Tye': 'txt/html; charset=utf-8'
      });
      const posts = await Post.findAll(
        { order: [['id', 'DESC']] });// 降順
      res.end(pug.renderFile('./views/posts.pug', { posts }));
      break;
    case 'POST':
      // TODO POST の処理
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const content = params.get('content');
        console.info(`送信されました: ${content}`);
        await Post.create({
          content, // content : content の略
          postedBy: req.user
        });
        handleRedirectPosts(req, res);
      });
      break;
    default:
      util.handleBadrequest(req, res);
      break;  
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

module.exports = {
  handle
};