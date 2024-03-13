const path = require('path');

module.exports = {
	getPath(folders, file) {
		return path.join(path.dirname(require.main.filename), ...folders, file);
	},
};

// module.exports = path.dirname(process.mainModule.filename);
