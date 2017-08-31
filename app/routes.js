const Index = require('./controller/Index'),
	Search = require('./controller/Search');

module.exports = app => {
	app.get('/', Index.index);

	app.post('/search/byRego', Search.byRego);
};
