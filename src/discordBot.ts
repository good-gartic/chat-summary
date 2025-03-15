import {
  Client,
  GatewayIntentBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  OmitPartialGroupDMChannel,
} from 'discord.js';
import { DatabaseService } from './services/databaseService';
import { SummaryService } from './services/summaryService';
import { TOKEN, SUMMARY_CHANNEL_ID, RATE_LIMIT_HOURS, MILLISECONDS_IN_HOUR, SUMMARY_MAX_HOURS } from './config';
import { DefinitionService } from './services/definitionService';

export class DiscordBot {
  private client: Client;
  private databaseService: DatabaseService;
  private summaryService: SummaryService;
  private lastUsage: Map<string, number>;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });
    this.databaseService = new DatabaseService();
    this.summaryService = new SummaryService(this.client);
    this.lastUsage = new Map();
  }

  public start() {
    this.client.login(TOKEN);
    this.client.once('ready', async () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
      await this.databaseService.setupDatabase();
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      let text;

      if (message.content.startsWith('!define ')) {
        text = message.content.substring(8);
        this.handleDefineCommand(text, message);
      }

      if (message.content === '!define') {
        const messageId = message.reference?.messageId || null;
        if (!messageId) {
          return message.reply('Please reply to a message to define it.');
        }
        let repliedMessage = null;
        try {
          repliedMessage = await message.channel.messages.fetch(messageId);
        } catch (error) {
          return message.reply({ content: "Couldn't find the message." });
        }
        this.handleDefineCommand(repliedMessage.content, message);
      }
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === 'summary') {
        await this.handleSummaryCommand(interaction);
      }
    });
  }

  private async handleSummaryCommand(interaction: ChatInputCommandInteraction) {
    if (interaction.channelId !== SUMMARY_CHANNEL_ID) {
      await this.replyWithError(interaction, 'This command can only be used in the designated summary channel.');
      return;
    }

    const userId = interaction.user.id;
    if (!this.isRateLimitPassed(userId)) {
      const timeLeft = this.getTimeLeft(userId);
      await this.replyWithError(
        interaction,
        `You can use this command again in ${timeLeft.hours} hour(s) ${timeLeft.minutes} minute(s).`
      );
      return;
    }

    const hours = interaction.options.getInteger('hours') ?? 1;
    if (hours > SUMMARY_MAX_HOURS) {
      await this.replyWithError(interaction, `You can only summarize up to ${SUMMARY_MAX_HOURS} hours.`);
      return;
    }

    await interaction.deferReply();

    this.lastUsage.set(userId, Date.now());

    const cachedSummary = await this.databaseService.getSummaryFromDB(interaction.channelId, hours);
    if (cachedSummary) {
      await this.replyWithSummary(interaction, cachedSummary.summary);
      return;
    }

    const messages = await this.summaryService.fetchMessages(interaction.channelId, hours);
    if (!messages) {
      await interaction.followUp('No messages found in the given time frame.');
      return;
    }

    const summary = await this.summaryService.generateSummary(messages);
    await this.databaseService.saveSummary(interaction.channelId, summary, hours);

    await this.replyWithSummary(interaction, summary);
  }

  private async handleDefineCommand(text: string, message: OmitPartialGroupDMChannel<Message<boolean>>) {
    const definition = await DefinitionService.getDefinition(text);
    const embed = new EmbedBuilder().setTitle('Definition').setDescription(definition).setColor(0x00ae86);
    await message.reply({ embeds: [embed] });
  }

  private isRateLimitPassed(userId: string): boolean {
    const now = Date.now();
    const lastUsed = this.lastUsage.get(userId) || 0;
    return now - lastUsed >= RATE_LIMIT_HOURS * MILLISECONDS_IN_HOUR;
  }

  private getTimeLeft(userId: string): { hours: number; minutes: number } {
    const now = Date.now();
    const lastUsed = this.lastUsage.get(userId) || 0;
    const timeLeftMs = RATE_LIMIT_HOURS * MILLISECONDS_IN_HOUR - (now - lastUsed);
    const hours = Math.floor(timeLeftMs / MILLISECONDS_IN_HOUR);
    const minutes = Math.floor((timeLeftMs % MILLISECONDS_IN_HOUR) / (1000 * 60));
    return { hours, minutes };
  }

  private async replyWithError(interaction: ChatInputCommandInteraction, message: string) {
    await interaction.reply({ content: message, ephemeral: true });
  }

  private async replyWithSummary(interaction: ChatInputCommandInteraction, summary: string) {
    const embed = new EmbedBuilder().setDescription(summary).setColor(0x00ae86);
    await interaction.followUp({ embeds: [embed] });
  }
}
