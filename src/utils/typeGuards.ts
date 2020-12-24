import _ from "lodash";
import Ajv, { FormatDefinition } from "ajv";
import { GameRecord, HitUpdate, GamePost } from "../types";
import { InvalidBodyError } from "../utils";

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

// export function isHitBody(body: any): body is HitUpdate {
// 	const schema = {
// 		properties: {
// 			hand: { type: "string", required: true }
// 		}
// 	};

// 	try {
// 		validate(schema, body);
// 	} catch (err) {}
// }

// function validate(schema: object, data: object): true {
// 	const ajv = new Ajv();
// 	ajv.validate(schema, data);

// 	return true;
// }

// export function isGamePost(body: any): body is GamePost {
// 	const properties: ValidatorProperty[] = [];
// }
