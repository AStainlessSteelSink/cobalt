exports.run = (client, message, args, level) => {
  if (!args[0]) { // Show all commands
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    const commandNames = myCommands.keyArray();
    const keywords = client.responses;
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${message.settings.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    output += `\nAvailable info commands :: ${Object.keys(keywords).join(", ")}`;
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  } else { // Show individual command
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      let str = `= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\n`;
      if (command.conf.aliases.length > 0) { // Only show this row if the command has 1 or more aliases
        str += `aliases:: ${command.conf.aliases.join(", ")}\n`;
      }
      str += `= ${command.help.name} =`;
      message.channel.send(str, {code:"asciidoc"});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
