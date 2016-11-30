'use strict'
const express = require('express');
const path = require('path');
const fs = require('fs');
const superagent = require('superagent');
const router = express.Router();
const cheerio = require('cheerio');
const request = require('request');
const fetch = require('../util/fetch');
const toGB2312 = require('../util/toGB2312');
const newsModel = require('../db/newsDao');

router.get('/', (req, res, next)=>{
	newsModel.find({}, (err, data)=>{
		let d = data;
		console.log(data);
		res.render('news', {title: '微信小程序爬虫', data: d});
	})
	
	return ;

	getData().then(function(r){
		console.log(r.length);
		res.send(r);
	});
	
});

async function getData(i){
	let arr = [];
    try{
		let page = 1, pageAll = 2;
		for (; page < pageAll; page++){
			arr = arr.concat(await spider('http://weixin.sogou.com/weixin?query=%E5%B0%8F%E7%A8%8B%E5%BA%8F&type=2&page='+page+'&ie=utf8&p=01030402&dp=1'));
		}
		return arr;

    }catch(e){
        console.log('error', e);
    }
}

function spider(url){
	return new Promise((resolve, reject)=>{		
		superagent.get(url)
			.end(function (err, sres) {
			  // 常规的错误处理
			  if (err) {
				reject(err);
			  }

			  let $ = cheerio.load(sres.text);			  
			  let items = [];
			  $('.news-list .txt-box').each(function (idx, element) {
				let $element = $(element);
				let time = /^\d+\d$/g;
				let obj = {
				  title: toGB2312($element.find('h3 a').text()),
				  link: $element.find('h3 a').attr('href'),
				  description: toGB2312($element.find('.txt-info').text()),
				  author: toGB2312($element.find('.account').text()),
				  count: toGB2312($element.find('.s1').text()),
				  createTime: $element.find('.s2').text().match(/\d+/g)
				};
				items.push(obj);
				newsModel.save(obj, (err, data)=>{
					console.log(err);
					console.log(data);
				});
			  });

			  resolve(items);
			});
	})
}

module.exports = router;
