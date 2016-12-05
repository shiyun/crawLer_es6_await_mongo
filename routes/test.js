'use strict'
const fs = require('fs');

function readFile(path){
	return new Promise((resolve, reject)=>{
		fs.exists(path, (exists)=>{
			if (!exists) {
				reject('没有此文件'); 
				return ;
			}
			fs.readFile(path, (err, data)=>{
				if (err) {
					reject(err);
					return ;
				}
				resolve(data.toString());
			});
		})
	})
}

module.exports = async (url)=>{
	try{
		return await readFile(url);
	}catch(e){
		return e;
	}
};