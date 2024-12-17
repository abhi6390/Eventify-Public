import { Client, Account} from 'appwrite';
import conf from '../config/config';

export const client = new Client();

client
    .setEndpoint(conf.appwrite.appwriteUrl)
    .setProject(conf.appwrite.projectId); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';
