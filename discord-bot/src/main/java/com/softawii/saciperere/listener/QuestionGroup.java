package com.softawii.saciperere.listener;

import com.softawii.curupira.annotations.IArgument;
import com.softawii.curupira.annotations.ICommand;
import com.softawii.curupira.annotations.IGroup;
import com.softawii.curupira.properties.Environment;
import com.softawii.saciperere.request.model.CategoryResponseBody;
import com.softawii.saciperere.request.model.ModelResponseBody;
import com.softawii.saciperere.request.model.QuestionHit;
import com.softawii.saciperere.util.ModelUtil;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.interaction.command.CommandAutoCompleteInteractionEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.Command;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import org.jetbrains.annotations.NotNull;

import java.awt.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static net.dv8tion.jda.api.interactions.commands.Command.*;

@IGroup(name = "question", description = "", hidden = true)
public class QuestionGroup {

    @ICommand(name = "make-question", description = "Faça uma pergunta e tenha uma resposta", environment = Environment.BOTH)
    @IArgument(name = "category", description = "Categoria no qual a pergunta será buscada", type = OptionType.STRING, required = true, hasAutoComplete = true)
    @IArgument(name = "question", description = "Pergunta que será feita", type = OptionType.STRING, required = true)
    public static void makeQuestion(SlashCommandInteractionEvent event) {
        String question = event.getOption("question").getAsString();
        long category = event.getOption("category").getAsLong();
        ModelResponseBody response = ModelUtil.makeQuestion(question, category);
        EmbedBuilder embedBuilder = new EmbedBuilder();
        embedBuilder.addField("Pergunta feita", question, false);
        embedBuilder.addField("Pergunta encontrada", response.question(), false);
        embedBuilder.addField("Resposta da pergunta encontrada", response.answer(), false);
        embedBuilder.addField("Score", String.format("%.2f", response.score()), false);
        embedBuilder.addField("Outras perguntas possivelmente associadas",
            Arrays.stream(response.hits())
                .skip(1)
                .map(questionHit -> "- "+questionHit.question())
                .collect(Collectors.joining("\n")),
            false);

        if (response.score() > 0.75) {
            embedBuilder.setColor(Color.GREEN);
        } else if (response.score() > 0.50) {
            embedBuilder.setColor(Color.ORANGE);
        } else {
            embedBuilder.setColor(Color.RED);
        }
        event.replyEmbeds(embedBuilder.build()).queue();
    }

    @ICommand(name = "categories", description = "Descubra quais categorias estão disponíveis", environment = Environment.BOTH)
    public static void categories(SlashCommandInteractionEvent event) {
        CategoryResponseBody[] categories = ModelUtil.getCategories();
        EmbedBuilder embedBuilder = new EmbedBuilder();
        embedBuilder.addField("Categorias",
            Arrays.stream(categories)
                .map(CategoryResponseBody::name)
                .collect(Collectors.joining("\n")),
            false);
        event.replyEmbeds(embedBuilder.build()).queue();
    }
    
    public static class AutoCompleter extends ListenerAdapter {
        @Override
        public void onCommandAutoCompleteInteraction(@NotNull CommandAutoCompleteInteractionEvent event) {
            String path = event.getCommandPath();
            String focusedKey   = event.getFocusedOption().getName();
            String focusedValue = event.getFocusedOption().getValue();
            
            if (path.equals("make-question") && focusedKey.equals("category")) {
                CategoryResponseBody[] categories = ModelUtil.getCategories();
                Command.Choice[] choices = Arrays.stream(categories)
                    .filter(category -> category.name().toLowerCase().startsWith(focusedValue.toLowerCase()))
                    .map(category -> new Command.Choice(category.name(), category.id()))
                    .toArray(Command.Choice[]::new);
                event.replyChoices(choices).queue();
            } else {
                event.replyChoices(new Command.Choice("set new path", "-1")).queue();
            }
        }
    }

}
