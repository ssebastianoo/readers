import PocketBase from 'pocketbase';
import { variables } from './variables';

export const client = new PocketBase(variables.pocketbaseURL);
