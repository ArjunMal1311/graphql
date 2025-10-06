import { connection } from './connection.ts';

const getUserTable = () => connection.table('user');

export async function getUser(username) {
  return await getUserTable().first().where({ username });
}
