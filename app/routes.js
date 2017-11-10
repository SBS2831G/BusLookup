const Index = require('./controller/Index'),
	Search = require('./controller/Search'),
	advancedSearch = require('./controller/AdvancedSearch');

module.exports = app => {
	app.get('/', Index.index);

	app.post('/search/byRego', Search.byRego);
	app.post('/search/byService', Search.byService);
	app.post('/search/advancedSearch', advancedSearch);
};
