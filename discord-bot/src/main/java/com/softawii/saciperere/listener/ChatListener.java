package com.softawii.saciperere.listener;

import com.softawii.saciperere.entity.ChannelCategory;
import com.softawii.saciperere.repository.ChannelCategoryRepository;
import com.softawii.saciperere.request.model.ModelResponseBody;
import com.softawii.saciperere.util.ModelUtil;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ChatListener extends ListenerAdapter {

    private final ChannelCategoryRepository repository;

    public ChatListener(ChannelCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void onMessageReceived(@NotNull MessageReceivedEvent event) {
        if (event.getAuthor().isBot()) return;

        if (event.isFromGuild()) {
            User author = event.getAuthor();
            Message message = event.getMessage();
            long channelId = message.getGuildChannel().getIdLong();
            Optional<ChannelCategory> channelCategoryOptional = repository.findById(channelId);
            if (channelCategoryOptional.isPresent()) {
                ChannelCategory channelCategory = channelCategoryOptional.get();
                String content = message.getContentDisplay();
                ModelResponseBody response = ModelUtil.makeQuestion(content, channelCategory.getCategoryId());
                if (response.score() >= QuestionGroup.THRESHOLD) {
                    EmbedBuilder embedBuilder = new EmbedBuilder();
                    embedBuilder.addField("Pergunta encontrada", response.question(), false);
                    embedBuilder.addField("Resposta", response.answer(), false);
                    message.replyEmbeds(embedBuilder.build())
                        .setActionRow(QuestionGroup.getFeedbackButtons(response.historyId(), author.getIdLong()))
                        .queue();
                }
            }
        }
    }
}
