const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

exports.addMessage = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Received message request data:", data);

    // Validate required fields
    if (!data.text || !data.userId) {
      logger.log("Required fields (text or userId) are missing");
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Required fields (text or userId) are missing"
      );
    }

    const { text, userId } = data;

    // Construct message data
    const messageData = {
      text,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const messageRef = await admin
      .firestore()
      .collection("chats")
      .doc(userId)
      .collection("messages")
      .add(messageData);

    logger.log("Message written with ID:", messageRef.id);
    return { status: "success", messageID: messageRef.id };
  } catch (error) {
    logger.error("Error adding message:", error);
    throw new functions.https.HttpsError("internal", "Error adding message");
  }
});
