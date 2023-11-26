const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const util = require('util');
const json = require('json5');

async function createEmbeds(filePath) {
	const embeds = [];
	const regex = /\\u\w*/g;
	const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B06}\u{2934}\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F251}\u{1F300}-\u{1F320}\u{1F330}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F380}-\u{1F393}\u{1F3A0}-\u{1F3C4}\u{1F3C6}-\u{1F3CA}\u{1F3E0}-\u{1F3F0}\u{1F400}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4F7}\u{1F4F9}-\u{1F4FC}\u{1F500}-\u{1F53D}\u{1F550}-\u{1F567}\u{1F5C0}-\u{1F5D5}\u{1F5E0}-\u{1F5EA}\u{1F5FB}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F773}\u{1F780}-\u{1F7D8}\u{1F7E0}-\u{1F7EB}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F900}-\u{1F9B6}\u{1F9C0}-\u{1F9C2}\u{1F9D0}-\u{1F9FF}\u{1FA60}-\u{1FA6D}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAA8}\u{1FAB0}-\u{1FAB6}\u{1FAC0}-\u{1FAC2}\u{1FAD0}-\u{1FAD6}\u{200D}\u{FE0F}]/gu;
	try {
		const data = await readFileSync(filePath, 'utf8');
		const jsonData = json.parse(data);
		for (const msg of jsonData['messages']) {
			let text = msg.content.replace(regex, '').replace(emojiRegex, '');
			if (text === '') {
				text = 'placeholder';
			}
			const exampleEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				// .setTitle('a')
				.setAuthor({ name: msg.author.name, iconURL: msg.author.avatarUrl })
				// .setDescription(msg.content);
				.addFields([{ name: 'Author', value: `<@!${msg.author.id}>` }, { name: 'Message', value: text }]);
				// .setDescription('Test');
			embeds.push(exampleEmbed);
		}
		return embeds;
	}
	catch (error) {
		console.error(error);
		return [];
	}


}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('post-archived-embeds')
		.setDescription('Replies with Pong for now!'),
	async execute(interaction) {
		const embeds = await createEmbeds('./files/misc3.json');
		console.log(embeds);
		const sent = await interaction.reply('From #miscellanous');
		for (const embed of embeds) {
			await interaction.channel.send({ embeds: [embed] });
			// break;
		}
	},

};