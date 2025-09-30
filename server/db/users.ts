import { connection } from './connection.ts';

const getUserTable = () => connection.table('user');

export async function getUser(id) {
    return await getUserTable().first().where({ id });
}

export async function getUserByEmail(email) {
    return await getUserTable().first().where({ email });
}
