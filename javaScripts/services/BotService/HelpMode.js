const {
  appendToArray,
  delUserVars,
  delAllUserVars,
  setUserVars,
  getAllListElements,
  publishToChannel,
} = require("../../../database/redis");
const template = require("../../../locales/templates");
const { HelpPhasesEnum } = require("../../ENUMS/EHelpPhase");
const { ModeEnum } = require("../../ENUMS/EMode");
const sendMsg = require("../../phases");
const storeNewMessage = require("../../../app/controllers/helpMessagesController")

const attributes = {
  language: "ar",
  translation: {},
};
const appendMessage = ({ receiver_id, sender, sender_id, message }) => {
  const receiver = receiver_id.replace("whatsapp:+", "");
  sendMsg.customMessage(
    template(
      "help_mode",
      attributes.language,
      attributes.translation.continue_typing,
      sender,
      receiver
    ),
    sender_id,
    receiver_id
  );
  appendToArray(receiver_id, sender, "msg", message);
};

const overWriteMessage = async ({
  receiver_id,
  sender,
  message,
  sender_id,
}) => {
  const receiver = receiver_id.replace("whatsapp:+", "");
  delUserVars(receiver_id, sender, "msg");
  sendMsg.customMessage(
    template(
      "help_mode",
      attributes.language,
      attributes.translation.continue_typing,
      sender,
      receiver
    ),
    sender_id,
    receiver_id
  );
  appendToArray(receiver_id, sender, "msg", message);
};

const changeToOverWritePhase = async ({ receiver_id, sender, sender_id }) => {

  setUserVars(receiver_id, sender, "phase", HelpPhasesEnum.OVER_WRITE);
  sendMsg.customMessage(
    attributes.translation.write_another_message,
    sender_id,
    receiver_id
  );
};

const sendMessage = async (receiver_id, sender, sender_id , userName ) => {
  const receiver = receiver_id.replace("whatsapp:+", "");

  // pushing  message into redis channel

  const session_message = await getAllListElements(receiver_id, sender, "msg");
  const contentMessage = session_message.reduce(
    (pre, cur) => pre + "\n" + cur,
    ""
  );
  publishToChannel(receiver, "stores", "message", contentMessage, sender, userName);

  // pushing to database if success
  storeNewMessage(receiver, sender, contentMessage, userName)

  setUserVars(receiver_id, sender, "mode", ModeEnum.bot);
  delAllUserVars(receiver_id, sender);
  sendMsg.customMessage(
    attributes.translation.message_sent,
    sender_id,
    receiver_id
  );
};

const displayUserMessage = async ({ receiver_id, sender, sender_id }) => {
  const session_messages = await getAllListElements(receiver_id, sender, "msg");
  const message = session_messages.reduce((pre, cur) => pre + "\n" + cur, "");
  const receiver = receiver_id.replace("whatsapp:+", "");
  sendMsg.customMessage(message, sender_id, receiver_id);
  sendMsg.customMessage(
    template(
      "help_mode",
      attributes.language,
      attributes.translation.continue_typing,
      sender,
      receiver
    ),
    sender_id,
    receiver_id
  );
};

const HelpModeService = {
  appendMessage,
  overWriteMessage,
  sendMessage,
  changeToOverWritePhase,
  displayUserMessage,
};

module.exports = {
  HelpModeService,
  attributes,
};
