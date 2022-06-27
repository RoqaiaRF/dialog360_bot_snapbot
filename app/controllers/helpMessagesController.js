// define relationships

// Conversations  hasMany messages
Conversations.hasMany(Messages, {
    as: "messages",
    foreignKey: "conversation_id",
    targetKey: "id",
  });
  
  Messages.belongsTo(Conversations, {
    as: "conversations",
    foreignKey: "conversation_id",
    targetKey: "id",
  });