import { Client, Account, Databases, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('695bd8e00034c34f602c'); // <--- REPLACE THIS

export const account = new Account(client);
export const databases = new Databases(client);

// Configuration Constants
export const DB_ID = '695bd96f000a0aeb2e05'; // <--- REPLACE THIS
export const COLLECTION_ID = 'gameconfig'; // <--- REPLACE THIS

// Helper to fetch PC Config
export const getGameConfig = async (pcId) => {
    try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.equal('pc_id', pcId)
        ]);
        return response.documents[0];
    } catch (error) {
        console.error("Config Fetch Error", error);
        return null;
    }
};

// Helper to Create/Update Config (For Admin Setup)
export const saveGameConfig = async (pcId, level1Pass, resumePin) => {
    // Check if exists first
    const existing = await getGameConfig(pcId);

    const data = {
        pc_id: pcId,
        level1_password: level1Pass,
        resume_pin: resumePin,
        is_active: true
    };

    if (existing) {
        return databases.updateDocument(DB_ID, COLLECTION_ID, existing.$id, data);
    } else {
        return databases.createDocument(DB_ID, COLLECTION_ID, 'unique()', data);
    }
};