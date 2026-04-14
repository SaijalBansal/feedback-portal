const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONN);
const database = client.database("feedbackdb");
const container = database.container("feedback");

module.exports = async function (context, req) {
    if (req.method === "POST") {
        const { name, feedback } = req.body;
        const item = {
            id: Date.now().toString(),
            name,
            feedback,
            timestamp: new Date().toISOString()
        };
        await container.items.create(item);
        context.res = { status: 200, body: item };
    }

    if (req.method === "GET") {
        const { resources } = await container.items.readAll().fetchAll();
        context.res = { status: 200, body: resources };
    }
};
