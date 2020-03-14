import _ from "lodash";

export function isStringArray(items: any): items is Array<string> {
	if (!_.isArray(items)) return false;

	for (const item of items) {
		if (!_.isString) return false;
	}

	return true;
}
