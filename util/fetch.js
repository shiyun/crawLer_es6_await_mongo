'use strict'

const request = require('request');

module.exports = (url, type, data) => {
	type = type || 'POST';
	return new Promise((resolve, reject)=>{
		if(type == 'POST'){
			request.post(url, (err, resp, body)=>{
				if(err) {
					reject(err);
					return ;
				}
				resolve(body);
			}).form(data);
		}else{
			request.get(url, (err, resp, body)=>{
				if(err) reject(err);
				resolve(body);
			});
		}
	})
};