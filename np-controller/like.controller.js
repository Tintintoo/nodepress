/*
*
* 点赞功能控制器
*
*/

const { handleError, handleSuccess } = require('np-utils/np-handle');

const Article = require('np-model/article.model');
const Comment = require('np-model/comment.model');
const Option = require('np-model/option.model');

const config = require('np-config');

module.exports = ({ body: { id, type }}, res) => {

	// 验证，1=>评论，2=>页面
	if (![1, 2].includes(type)) {
		res.jsonp({ code: 0, message: '点赞失败，没有原因' });
	}

	// like
	(Object.is(type, 1) ? Comment : (Object.is(id, 0) ? Option : Article))
	.findOne((() => (Object.is(id, 0)) ? {} : { id })())
	.then(result => {
		if (Object.is(type, 1)) {
			result.likes ++;
		} else {
			result.meta.likes ++;
		}
		result.save().then(info => {
			// console.log('赞更新成功', info);
		}).catch(err => {
			console.warn('赞更新失败', err);
		});
		handleSuccess({ res, message: '点赞成功' });
	}).catch(err => {
		handleError({ res, err, message: '点赞失败' });
	})
};
