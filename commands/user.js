const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
		.addUserOption(option => option.setName('target').setDescription('Choose the user to display information of')),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		const targetUser = interaction.options.getUser('target');
		if (targetUser) {
			const targetGuildMember = interaction.guild.members.resolve(targetUser);
			console.log(`${targetGuildMember} and ${targetGuildMember.joinedAt}`);
			await interaction.reply({ content: `This command was run by <@${targetUser.id}>, who joined on ${targetGuildMember.joinedAt}.`, allowedMentions:{ parse: [] } });
		}
		else {
			await interaction.reply({ content: `This command was run by <@${interaction.user.id}>, who joined on ${interaction.member.joinedAt}.`, allowedMentions:{ parse: [] } });
		}
	},
};
