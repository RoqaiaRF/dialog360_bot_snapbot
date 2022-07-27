var events = require("events");
const { getUserVars, publishToChannel, client } = require("../../../database/redis");
const { ModeEnum } = require("../../ENUMS/EMode");
const { BotService } = require("./BotService");
var BotEventEmitter = new events.EventEmitter();
BotEventEmitter.on(
  "logout_help_mode",
  async ({ storObj, sender, username, conversation_id }) => {
    console.log(storObj);
    const receiver_id = `whatsapp:+${storObj.phone}`;
    const sender_id = `whatsapp:+${sender}`;
    const receiver = storObj.phone;
    let mode = await getUserVars(receiver, sender, "mode");
    mode = mode ? mode : ModeEnum.bot;
    mode == ModeEnum.bot
      ? console.log("booot")
      : (async () => {
          let language = await getUserVars(receiver_id, sender, "language");
          if (language == undefined) language = "ar";
          const translation = require(`../../../locales/${language}`);
          const args = {
            storeAR_Name: storObj.name_ar,
            storeEN_Name: storObj.name_en,
            username,
            storObj,
            translation,
          };
          BotService.logoutHelpMode({
            sender_id,
            receiver_id,
            receiver,
            sender,
            args,
          });
        })();

    client.publish(
      `message`,
      JSON.stringify({ type: "status", store_id: storObj.id, conversation_id }),
      (error, count) => {
        if (error) {
          throw new Error(error);
        }

      }
    );
  }
);

module.exports = {
  BotEventEmitter,
};
