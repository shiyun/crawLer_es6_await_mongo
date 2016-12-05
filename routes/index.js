'use strict'
const express = require('express');
const path = require('path');
const fs = require('fs');
const Event = require('events').EventEmitter;
const superagent = require('superagent');
const router = express.Router();
const cheerio = require('cheerio');
const request = require('request');
const fetch = require('../util/fetch');
const toGB2312 = require('../util/toGB2312');
const newsModel = require('../db/newsDao');
const readFile = require('./test');

let myEvent = new Event();

router.get('/test', (req, res, next)=>{
	let url = req.query.url;
	readFile(path.join(__dirname, url))
		.then(data=>{
			console.log(data);
			
			res.send(data)
		})
});

router.get('/', (req, res, next)=>{
	let key = req.query.words;
	if(key == undefined) res.send('无');
	console.log(encodeURIComponent(key));

	newsModel.find({title: new RegExp(key, 'g')}, (err, data)=>{
		let d = data;
		console.log(data);
		res.render('news', {title: key, data: d});
	})

	return ;


	getData(key).then(function(r){
		console.log(r);
		//res.render('news', {title: key, data: r});
		res.send(r);
	});
	return ;
});

async function getData(key){
	let arr = [];
    try{
		let page = 1, pageAll = 1;
		for (; page < pageAll; page++){
			arr = arr.concat(await spider('http://weixin.sogou.com/weixin?query='+encodeURIComponent(key)+'&type=2&page='+page+'&ie=utf8&p=01030402&dp=1'));
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
			  console.log(sres.text);
			  let items = [];
			  $('.news-list .txt-box').each(function (idx, element) {
				let $element = $(element);
				let obj = {
				  title: toGB2312($element.find('h3 a').text()),
				  link: $element.find('h3 a').attr('href'),
				  description: toGB2312($element.find('.txt-info').text()),
				  author: toGB2312($element.find('.account').text()),
				  count: toGB2312($element.find('.s1').text()),
				  createTime: $element.find('.s2').text().match(/\d+/g)
				};
				items.push(obj);
				console.log('=======================================');
				console.log(obj);
				console.log('=======================================');
				/*
				newsModel.save(obj, (err, data)=>{
					console.log(err);
					console.log(data);
				});
				*/
			  });

			  resolve(items);
			});
	})
}

module.exports = router;
