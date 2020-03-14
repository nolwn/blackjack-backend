import { Resource, Record } from "../types";

export function fixIds(records: Record[]): Resource[] {
	return records.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
}
