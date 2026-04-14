const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONN);
const database = client.database("feedbackdb");
const container = database.container("feedback");

module.exports = async function (context, req) {
    const text = req.rawBody;

    function extractValue(label) {
        const regex = new RegExp(label + ": (.*)");
        const match = text.match(regex);
        return match ? match[1].trim() : "";
    }

    const item = {
        id: Date.now().toString(),
        type: "document",
        name: extractValue("Name"),
        feedback: extractValue("Feedback"),
        rating: extractValue("Rating"),
        rawText: text,
        timestamp: new Date().toISOString()
    };

    await container.items.create(item);
    context.res = { status: 200, body: item };
};
