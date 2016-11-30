'use strict'
const mongodb = require('./mongodb');
const Schema = mongodb.mongoose.Schema;

let NewsSchema = new Schema({
	title:String,  
    link :String,  
    description :String,  
    author :String,
	count: Number,
    createTime : String //{type: Date, default: Date.now()}
});

let NewsModel = mongodb.mongoose.model('news', NewsSchema);

class NewsDao{
	constructor(){
		
	}

	save(obj, callback){
		let news = new NewsModel(obj);
		news.save(obj, (err)=>{
			callback(err);
		});
	}

	find(obj, callback){
		NewsModel.find(obj, (e, data)=>callback(e, data))
	}
	
	remove(obj, callback){
		NewsModel.remove(obj, (e, data)=>callback(e, data));
	}
}

module.exports = new NewsDao();