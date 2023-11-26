const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showtopreactions')
		.setDescription('Get the message with the highest amount of reactions in the channel.')
		.addStringOption(option => option.setName('top-message-id-so-far').setDescription('The message that has highest reaction so far'))
		.addStringOption(option => option.setName('last-message-processed').setDescription('The message that was processed in the last pass')),

	async execute(interaction) {
		let topMessage;
		let lastMessage;
		let topReactions = 0;
		let processedSoFar = 0;
		const sent = await interaction.reply({ content: 'Scanning Messages...', fetchReply: true });
		let topMessageIDSoFar = interaction.options.getString('top-message-id-so-far') ? BigInt(interaction.options.getString('top-message-id-so-far')) : 0;
		let lastMessageProcessed = interaction.options.getString('last-message-processed') ? BigInt(interaction.options.getString('last-message-processed')) : 0;

		console.log(topMessageIDSoFar, lastMessageProcessed);
		// Fetch messages in the channel
		let messages;
		if (lastMessageProcessed) {
			messages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageProcessed });
		}
		else if (topMessageIDSoFar) {
			messages = await interaction.channel.messages.fetch({ limit: 100, before: topMessageIDSoFar });
		}
		else {
			messages = await interaction.channel.messages.fetch({ limit: 100 });
		}

		if (topMessageIDSoFar) {
			const topMsg = await interaction.channel.messages.fetch({ limit: 1, around: topMessageIDSoFar });
			topMsg.forEach((msg, _) => {
				msg.reactions.cache.forEach((reac, _key) => {
					if (reac.count > topReactions) {
						topReactions = reac.count;
						topMessage = msg;
					}
				});
			});
		}

		processedSoFar += messages.size;
		console.log(processedSoFar);
		messages.forEach((msg, key) => {
			lastMessage = msg;
			msg.reactions.cache.forEach((reac, _) => {
				if (reac.count > topReactions) {
					topReactions = reac.count;
					topMessage = msg;
				}
			});
		});

		await new Promise(r => setTimeout(r, 100));

		while (messages.size === 100) {
			interaction.editReply(`Scanning Messages...\nScanned Messages: ${processedSoFar}\nTop Message ID So Far: ${topMessageIDSoFar} - ${topReactions}\nLast Processed Message ID: ${lastMessageProcessed}`);

			messages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessage.id });
			processedSoFar += messages.size;

			console.log(processedSoFar);
			messages.forEach((msg, key) => {
				lastMessage = msg;
				lastMessageProcessed = lastMessage.id;
				msg.reactions.cache.forEach((reac, _) => {
					if (reac.count > topReactions) {
						topReactions = reac.count;
						topMessage = msg;
						topMessageIDSoFar = topMessage.id;
					}
				});
			});
			await new Promise(r => setTimeout(r, 100));
		}

		if (topMessage) {
			return interaction.editReply(`The message with the most reactions has ${topReactions} reactions:\n${`https://discord.com/channels/${topMessage.guildId}/${topMessage.channelId}/${topMessage.id}`}`);
		}
		else {
			return interaction.editReply('No messages with reactions found in this channel.');
		}
	},
};