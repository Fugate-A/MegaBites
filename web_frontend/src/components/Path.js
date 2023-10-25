const app_name = '164.90.130.112:5000/'
exports.buildPath =
	function buildPath(route) {
		if (process.env.NODE_ENV === 'production') {
			return app_name + route;
		}
		else {
			return 'http://localhost:5000/' + route;
		}
	}