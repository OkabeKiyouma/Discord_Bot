const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pick')
		.setDescription('Pick an option from the list of items provided.')
		.addStringOption(option => option.setName('list').setDescription('Separate list items by comma').setRequired(true)),
	async execute(interaction) {
		let listofItem = interaction.options.getString('list');
		if (listofItem) {
			listofItem = listofItem.split(',').filter(list => list != '');
			console.log(listofItem);
			console.log(listofItem.length);
			if (listofItem.length < 2) {return interaction.reply({ content: 'Please enter more than 1 values', ephemeral:true });}
			const choice = Math.floor(Math.random() * (listofItem.length - 1));
			return interaction.reply(`The pick was ${listofItem[choice]}`);
		}
		return interaction.reply({ content: 'Please enter a proper list', ephemeral:true });
	},
};