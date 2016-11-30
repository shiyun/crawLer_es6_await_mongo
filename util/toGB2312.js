'use strict'

module.exports = (str)=>{
	return unescape(str.replace(/&#x/g,'%u').replace(/;/g, ''));
}
