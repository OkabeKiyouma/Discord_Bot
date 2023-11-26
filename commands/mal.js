/* eslint-disable no-mixed-spaces-and-tabs */
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { MALClientId } = require('./../config.json');

const titleCase = (s) => {
	if (s.toLowerCase() === 'tv' || s.toLowerCase() === 'ona' || s.toLowerCase() === 'ova') return s.toUpperCase();
	return s.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
		.replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
};

const upperCase = (s) => {
	return s.replace(/^[-_]*/, () => '')
		.replace(/[-_]+/g, () => ' ')
		.replace(/\w/g, (c) => c.toUpperCase());
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mal')
		.setDescription('Get the anime information.')
		.addStringOption(option => option.setName('anime').setDescription('The anime to show').setRequired(true)),
	async execute(interaction) {
		const anime = interaction.options.getString('anime');
		const baseURL = 'https://api.myanimelist.net/v2/anime';
		const finalURL = `${baseURL}?q=${anime.replaceAll(' ', '%20')}&limit=3`;
		const options = {
			headers: {
				'X-MAL-CLIENT-ID': MALClientId,
			},
		};
		const animelist = [];
		const buttons = [];
		console.log(finalURL, options, options.headers['X-MAL-CLIENT-ID'], options.headers);
		fetch(finalURL, options)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				console.log(data['data']);
				for (const [i, root] of data['data'].entries()) {
					console.log(root.node.title);
					animelist.push({ name: `${i + 1}`, value: `${root.node.title}` });
					const button = new ButtonBuilder()
						.setCustomId(`mal-primary>${root.node.id}`)
						.setLabel(`${root.node.title}`)
						.setStyle(ButtonStyle.Primary);
					buttons.push(button);
				}
				let nickname = interaction.member.nickname;
				if (nickname == null) {
					nickname = interaction.user.username;
				}
				const Choice = new ActionRowBuilder()
					.addComponents(
						buttons,
					);
				const AnimeListEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(`Search Results for \`${anime}\``)
					.setAuthor({ name: `${nickname}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
					// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
					.addFields(
						animelist,
					)
					// .setImage('https://i.imgur.com/AfFp7pu.png')
					.setTimestamp();
				// .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
				return interaction.reply({ components: [Choice], embeds: [AnimeListEmbed] });
			});
	},
	async replyButton(interaction) {
		const id = interaction.customId.split('>')[1];
		const baseURL = `https://api.myanimelist.net/v2/anime/${id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,created_at,updated_at,media_type,status,genres,num_episodes,start_season,source,rating,studios`;
		const options = {
			headers: {
				'X-MAL-CLIENT-ID': MALClientId,
			},
		};
		await fetch(baseURL, options)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				let nickname = interaction.member.nickname;
				if (nickname == null) {
					nickname = interaction.user.username;
				}
				let genres = '';
				for (const genre of data.genres) {
					genres += `${genre.name}\n`;
				}
				if (genres === '') genres += 'None\n';
				genres = genres.slice(0, genres.length - 1);
				const fields = [
					{ name: '\u0000', value: `${data.synopsis.length > 200 ? data.synopsis.slice(0, 200) + '...' : data.synopsis}` },
					// { name: '\u0000 ', value: '\u0000', inline: true },
					{ name: 'Score', value: `${data.mean}`, inline: true },
					{ name: 'Rank/Popularity', value: `${data.rank}/${data.popularity}`, inline: true },
					{ name: 'Aired', value: `${data.start_date} to ${data.end_date}`, inline: true },
					{ name: 'Type', value: `${titleCase(data.media_type)}`, inline: true },
					{ name: 'Status', value: `${titleCase(data.status)}`, inline: true },
					{ name: 'Episodes', value: `${data.num_episodes}`, inline: true },
					{ name: 'Source', value: `${titleCase(data.source)}`, inline: true },
					{ name: 'Rating', value: `${upperCase(data.rating)}`, inline: true },
					{ name: '\u0000 ', value: '\u0000', inline: true },
					{ name: 'Genre', value: `${genres}` },
				];
				const AnimeEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(`${data.title}`)
					.setDescription(`${data.alternative_titles.ja}`)
					.setURL(`https://myanimelist.net/anime/${data.id}`)
					.setAuthor({ name: `${nickname}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
					.setThumbnail(`${data.main_picture.large}`)
					.addFields(
						fields,
					)
					// .setImage('https://i.imgur.com/AfFp7pu.png')
					.setTimestamp()
					.setFooter({ text: `Created at: ${data.created_at}\nUpdated at: ${data.updated_at}\n\n` });
				return interaction.update({ components: [], embeds: [AnimeEmbed] });
			});
	},
};