import _ from "lodash";
import { GameRecord } from "../types";

export function isStringArray(items: any): items is Array<string> {
	if (!_.isArray(items)) return false;

	for (const item of items) {
		if (!_.isString) return false;
	}

	return true;
}

export function isGameRecord(record: GameRecord | null): record is GameRecord {
	return !!record;
}
