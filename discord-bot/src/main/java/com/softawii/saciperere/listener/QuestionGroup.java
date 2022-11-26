package com.softawii.saciperere.listener;

import com.softawii.curupira.annotations.*;
import com.softawii.curupira.properties.Environment;
import com.softawii.saciperere.request.model.CategoryResponseBody;
import com.softawii.saciperere.request.model.ModelResponseBody;
import com.softawii.saciperere.request.model.TopicResponseBody;
import com.softawii.saciperere.util.ModelUtil;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.events.interaction.ModalInteractionEvent;
import net.dv8tion.jda.api.events.interaction.command.CommandAutoCompleteInteractionEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.Command;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.interactions.components.text.TextInput;
import net.dv8tion.jda.api.interactions.components.text.TextInputStyle;
import net.dv8tion.jda.api.interactions.modals.Modal;
import org.jetbrains.annotations.NotNull;

import java.awt.*;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@IGroup(name = "question", description = "", hidden = true)
public class QuestionGroup {

    private static final ExecutorService executor = Executors.newSingleThreadExecutor();
    
    private static final String MODAL_FEEDBACK_ACTION = "question-modal-feedback-action";
    private static final String TEXT_FEEDBACK_ACTION = "question-text-feedback-action";
    private static final String POSITIVE_FEEDBACK_ACTION = "question-positive-feedback-action";
    private static final String NEGATIVE_FEEDBACK_ACTION = "question-negative-feedback-action";
    
    private static final double THRESHOLD;
    static {
        double env = 0.5;
        try {
            env = Double.parseDouble(System.getenv("THRESHOLD"));
        } catch (Exception ignored) {}
        THRESHOLD = env;
    }
    private static final Color PRIMARY_COLOR = Color.decode("#63e2b7");
    
    @ICommand(name = "make-question", description = "Faça uma pergunta e tenha uma resposta", environment = Environment.BOTH)
    @IArgument(name = "topic", description = "Tópico no qual a pergunta será filtrada", type = OptionType.INTEGER, required = true, hasAutoComplete = true)
    @IArgument(name = "category", description = "Categoria no qual a pergunta será buscada", type = OptionType.STRING, required = true, hasAutoComplete = true)
    @IArgument(name = "question", description = "Pergunta que será feita", type = OptionType.STRING, required = true)
    public static void makeQuestion(SlashCommandInteractionEvent event) {
        event.deferReply().queue();
        String question = event.getOption("question").getAsString();
        long category = event.getOption("category").getAsLong();
        ModelResponseBody response;
        try {
            response = ModelUtil.makeQuestion(question, category);
        } catch (Exception e) {
            event.getHook().editOriginalEmbeds(getApiErrorEmbed()).queue();
            e.printStackTrace();
            return;
        }
        EmbedBuilder embedBuilder = new EmbedBuilder();

        embedBuilder.setTitle(question);
        embedBuilder.setFooter(event.getUser().getAsTag(), event.getUser().getAvatarUrl());
        if (response.score() >= THRESHOLD) {
            embedBuilder.addField("Pergunta encontrada", response.question(), false);
            embedBuilder.addField("Resposta", response.answer(), false);
            embedBuilder.addField("Outras perguntas possivelmente associadas",
                Arrays.stream(response.hits())
                    .skip(1)
                    .map(questionHit -> "- " + questionHit.question())
                    .collect(Collectors.joining("\n")),
                false);
            embedBuilder.setColor(getScoreColor(response.score()));
            event.getHook().editOriginalEmbeds(embedBuilder.build())
                .queue(interactionHook -> {
                    String positiveId = String.format("%s:%s", POSITIVE_FEEDBACK_ACTION, response.historyId());
                    String negativeId = String.format("%s:%s", NEGATIVE_FEEDBACK_ACTION, response.historyId());
                    String textId = String.format("%s:%s", TEXT_FEEDBACK_ACTION, response.historyId());

                    Button successButton = Button.success(positiveId, "Era o que esperava");
                    Button cancelButton = Button.danger(negativeId, "Fora do esperado");
                    Button textButton = Button.secondary(textId, "Quero enviar um feedback em texto");

                    event.getHook().sendMessage("Qual feedback daria para o retorno do bot?")
                        .addActionRow(successButton, cancelButton, textButton)
                        .setEphemeral(true)
                        .queueAfter(2, TimeUnit.SECONDS);
                });
        } else {
            embedBuilder.setColor(Color.RED);
            embedBuilder.addField("Ops!", "Não encontramos pergunta similar em nossa base de dados", false);
            event.getHook().editOriginalEmbeds(embedBuilder.build()).queue();
        }
    }

    @NotNull
    private static Color getScoreColor(double score) {
        // Normalize
        score = (score - 0.5) / (1 - 0.5);

        // Color between orange and green
        int r = (int) (Color.ORANGE.getRed() + Math.min(1, score) * (Color.GREEN.getRed() - Color.ORANGE.getRed()));
        int g = (int) (Color.ORANGE.getGreen() + Math.min(1, score) * (Color.GREEN.getGreen() - Color.ORANGE.getGreen()));
        int b = (int) (Color.ORANGE.getBlue() + Math.min(1, score) * (Color.GREEN.getBlue() - Color.ORANGE.getBlue()));
        return new Color(r, g, b);
    }
    
    private static MessageEmbed getApiErrorEmbed() {
        EmbedBuilder builder = new EmbedBuilder();
        builder.setTitle("Ops! Ocorreu algum erro na comunicação com a API");        
        return builder.build();
    }

    @ICommand(name = "topics", description = "Descubra quais tópicos estão disponíveis", environment = Environment.BOTH)
    public static void topics(SlashCommandInteractionEvent event) {
        event.deferReply().queue();
        TopicResponseBody[] topics;
        try {
            topics = ModelUtil.getTopics();
        } catch (Exception e) {
            event.getHook().editOriginalEmbeds(getApiErrorEmbed()).queue();
            e.printStackTrace();
            return;
        }
        EmbedBuilder embedBuilder = new EmbedBuilder();
        embedBuilder.addField("Tópicos",
            Arrays.stream(topics)
                .map(TopicResponseBody::name)
                .collect(Collectors.joining("\n")),
            false);
        embedBuilder.setColor(PRIMARY_COLOR);
        event.getHook().editOriginalEmbeds(embedBuilder.build()).queue();
    }

    @ICommand(name = "categories-by-id", description = "Descubra quais categorias estão disponíveis por tópico", environment = Environment.BOTH)
    @IArgument(name = "topic", description = "Tópico no qual a categoria será filtrada", type = OptionType.INTEGER, required = true, hasAutoComplete = true)
    public static void categoriesById(SlashCommandInteractionEvent event) {
        event.deferReply().queue();
        long topic = event.getOption("topic").getAsLong();
        CategoryResponseBody[] categories;
        try {
            categories = ModelUtil.getCategories(topic);
        } catch (Exception e) {
            event.getHook().editOriginalEmbeds(getApiErrorEmbed()).queue();
            e.printStackTrace();
            return;
        }
        EmbedBuilder embedBuilder = new EmbedBuilder();
        embedBuilder.addField("Categorias",
            Arrays.stream(categories)
                .map(CategoryResponseBody::name)
                .collect(Collectors.joining("\n")),
            false);
        embedBuilder.setColor(PRIMARY_COLOR);
        event.getHook().editOriginalEmbeds(embedBuilder.build()).queue();
    }

    @IButton(id = POSITIVE_FEEDBACK_ACTION)
    public static void positiveFeedbackButton(ButtonInteractionEvent event) {
        System.out.println("Received positive feedback: " + event.getComponentId());
        String[] args = event.getComponentId().split(":");
        executor.submit(() -> {
            ModelUtil.saveFeedback(Long.parseLong(args[1]), 1, null);
        });
        event.editMessage("Obrigado pelo feedback!").setComponents().queue(interactionHook -> {
            interactionHook.deleteOriginal().queueAfter(2, TimeUnit.SECONDS);
        });
    }
    
    @IButton(id = NEGATIVE_FEEDBACK_ACTION)
    public static void negativeFeedbackButton(ButtonInteractionEvent event) {
        System.out.println("Received negative feedback: " + event.getComponentId());
        String[] args = event.getComponentId().split(":");
        executor.submit(() -> {
            ModelUtil.saveFeedback(Long.parseLong(args[1]), -1, null);
        });
        event.editMessage("Obrigado pelo feedback!").setComponents().queue(interactionHook -> {
            interactionHook.deleteOriginal().queueAfter(2, TimeUnit.SECONDS);
        });
    }

    @IButton(id = TEXT_FEEDBACK_ACTION)
    public static void editMessage(ButtonInteractionEvent event) {
        System.out.println("Received text feedback: " + event.getComponentId());
        String historyId = event.getComponentId().split(":")[1];
        TextInput body = TextInput.create("text", "Mensagem", TextInputStyle.PARAGRAPH)
            .setPlaceholder("Eu acho que...")
            .setMinLength(1)
            .setMaxLength(200)
            .build();
        Modal modal = Modal.create(String.format("%s:%s", MODAL_FEEDBACK_ACTION, historyId), "Enviar feedback")
            .addActionRow(body)
            .build();
        
        event.replyModal(modal).queue();
    }

    @IModal(id = MODAL_FEEDBACK_ACTION, title = "Enviar feedback", textInputs = {
        @IModal.ITextInput(id = "text", label = "Mensagem", style = TextInputStyle.PARAGRAPH,
            placeholder = "Eu acho que...", required = true, minLength = 1, maxLength = 200),
    })
    public static void modalMessage(ModalInteractionEvent event) {
        System.out.println("Received modal info: " + event.getModalId());
        String feedback = event.getValue("text").getAsString();
        String historyId = event.getModalId().split(":")[1];
        executor.submit(() -> {
            ModelUtil.saveFeedback(Long.parseLong(historyId), 0, feedback);
        });
        event.editMessage("Obrigado pelo feedback!").setComponents().queue();
    }
    
    public static class AutoCompleter extends ListenerAdapter {
        @Override
        public void onCommandAutoCompleteInteraction(@NotNull CommandAutoCompleteInteractionEvent event) {
            String path = event.getCommandPath();
            String focusedKey   = event.getFocusedOption().getName();
            String focusedValue = event.getFocusedOption().getValue().trim();

            if (path.equals("make-question") && focusedKey.equals("category")) {
                long topicId = event.getOption("topic").getAsLong();
                CategoryResponseBody[] categories = ModelUtil.getCategories(topicId);
                Command.Choice[] choices = Arrays.stream(categories)
                    .filter(category -> focusedValue.isBlank() || category.name().toLowerCase().startsWith(focusedValue.toLowerCase()))
                    .map(category -> new Command.Choice(category.name(), category.id()))
                    .toArray(Command.Choice[]::new);
                event.replyChoices(choices).queue();
            } else if (focusedKey.equals("topic")) {
                TopicResponseBody[] topics = ModelUtil.getTopics();
                Command.Choice[] choices = Arrays.stream(topics)
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
