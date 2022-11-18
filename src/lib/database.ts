import PocketBase from 'pocketbase';
import { variables } from './utils';

export const client = new PocketBase(variables.pocketbaseURL);
