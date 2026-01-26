import { Client, Account, Databases, Query, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('695bd8e00034c34f602c');

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = '695bd96f000a0aeb2e05';
export const COLLECTION_ID = 'gameconfig';

// --- AUTH ---
export const verifyMasterPassword = async (password) => {
    try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.equal('pc_id', 'MASTER_ACCESS')
        ]);
        if (response.documents.length > 0) {
            return response.documents[0].level1_password === password;
        }
        return false;
    } catch (error) {
        return false;
    }
};

// --- TEAM MANAGEMENT ---

export const getAllTeams = async () => {
    try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.limit(100),
            Query.orderDesc('$createdAt')
        ]);
        return response.documents.filter(doc => doc.pc_id !== 'MASTER_ACCESS');
    } catch (error) {
        return [];
    }
};

export const subscribeToTeams = (callback) => {
    return client.subscribe(
        `databases.${DB_ID}.collections.${COLLECTION_ID}.documents`,
        (response) => { callback(response); }
    );
};

export const subscribeToTeamStatus = (docId, callback) => {
    return client.subscribe(
        `databases.${DB_ID}.collections.${COLLECTION_ID}.documents.${docId}`,
        (response) => { callback(response.payload); }
    );
};

export const subscribeToSessionDeletion = (targetDocId, onDeleted) => {
    return client.subscribe(
        `databases.${DB_ID}.collections.${COLLECTION_ID}.documents`,
        (response) => {
            if (response.events.some(event => event.endsWith('.delete'))) {
                if (response.payload.$id === targetDocId) {
                    onDeleted();
                }
            }
        }
    );
};

export const createTeamSession = async (pcId, level1Password) => {
    return databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
        pc_id: pcId,
        level1_password: level1Password,
        is_active: true,
        is_locked: false,
        current_level: 1,
        questions_solved: 0,
        reset_requested: false,
        active_question: "Level 1 Locked",
        active_answer: level1Password,
        history_logs: "[]"
    });
};

export const deleteTeam = async (docId) => {
    return databases.deleteDocument(DB_ID, COLLECTION_ID, docId);
};

export const getGameConfig = async (pcId) => {
    try {
        const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
            Query.equal('pc_id', pcId)
        ]);
        return response.documents[0];
    } catch (error) {
        return null;
    }
};

export const updateTeamProgress = async (docId, level, questionsSolved) => {
    if (!docId) return;
    const data = {};
    if (level !== null && level !== undefined) data.current_level = level;
    if (questionsSolved !== null && questionsSolved !== undefined) data.questions_solved = questionsSolved;

    try {
        await databases.updateDocument(DB_ID, COLLECTION_ID, docId, data);
    } catch (error) {
        console.error("Progress Sync Error", error);
    }
};

export const setTeamLockStatus = async (docId, isLocked) => {
    if (!docId) return;
    try {
        await databases.updateDocument(DB_ID, COLLECTION_ID, docId, {
            is_locked: isLocked
        });
    } catch (error) {
        console.error("Lock Update Error", error);
    }
};

export const updateLiveGameStatus = async (docId, updates) => {
    if (!docId) return;
    try {
        await databases.updateDocument(DB_ID, COLLECTION_ID, docId, updates);
    } catch (error) {
        console.error("Status Update Error", error);
    }
};

// --- RESET LOGIC ---

export const requestGameReset = async (docId) => {
    if (!docId) throw new Error("No Document ID found");
    return databases.updateDocument(DB_ID, COLLECTION_ID, docId, {
        reset_requested: true
    });
};

export const approveGameReset = async (docId, pcId, level1Pass) => {
    if (!docId) return;
    return databases.updateDocument(DB_ID, COLLECTION_ID, docId, {
        reset_requested: false,
        current_level: 1,
        questions_solved: 0,
        is_locked: false,
        active_question: "Game Reset - Level 1",
        active_answer: level1Pass || "Unknown",
        history_logs: "[]"
    });
};