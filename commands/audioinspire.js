const fetch = require("node-fetch");

exports.run = async (client, message, args, level) => {
    let sessionKey = client.settings.get("inspireSessionKey");
    if (sessionKey == null){
        message.channel.send(`${client.config.emojis.error} InspiroBot session key missing! Cannot run this command at the moment.`);
        return;
    }
	if (message.member.voice.channel) {
		const connection = await message.member.voice.channel.join();
        (async () => {
            try {
                await fetch('https://inspirobot.me/api?generateFlow=1&sessionID=' + sessionKey)
                  .then(res => res.json())
                  .then(body => {
                    connection.play(body.mp3);
                  });
                message.channel.stopTyping();
            } catch (err) {
                message.channel.send(`${client.config.emojis.error} An error has occured! InspiroBot may be having issues.`);
                client.logger.warn(`Error while retrieving/playing InspiroBot audio: ${err}`)
                message.channel.stopTyping();
            };
        })();
	} else {
        message.channel.send(`${client.config.emojis.error} You are not in a voice channel!`);
    }
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "audioinspire",
    category: "Audio",
    description: "Streams \"inspirational\" quotes for a minute or two to the voice channel you're in. Might decide to tell a story, who knows.",
    usage: "audioinspire"
  };
  