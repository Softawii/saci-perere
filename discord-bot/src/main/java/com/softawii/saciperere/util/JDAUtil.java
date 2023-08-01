package com.softawii.saciperere.util;

import com.softawii.curupira.core.Curupira;
import com.softawii.saciperere.Main;
import com.softawii.saciperere.listener.ChatListener;
import com.softawii.saciperere.listener.QuestionGroup;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.requests.GatewayIntent;

import javax.security.auth.login.LoginException;
import java.util.Objects;

public class JDAUtil {
    
    private static final String CURUPIRA_PACKAGE = "com.softawii.saciperere.listener";
    
    public static JDA initJDA() throws LoginException, InterruptedException {
        String discordToken = System.getenv("DISCORD_TOKEN");
        JDABuilder jdaBuilder = JDABuilder.createDefault(discordToken);
        jdaBuilder.enableIntents(GatewayIntent.MESSAGE_CONTENT);

        JDA jda = jdaBuilder.build();
        jda.addEventListener(new QuestionGroup.AutoCompleter());
        jda.addEventListener(Main.applicationContext.getBean(ChatListener.class));
        jda.awaitReady();
        initCurupira(jda);
        return jda;
    }
    
    private static void initCurupira(JDA jda) {
        boolean curupiraReset = Objects.requireNonNullElse(System.getenv("CURUPIRA_RESET"), "false").equals("true");
        System.out.printf("curupiraReset: %s%n", curupiraReset);
        new Curupira(jda, curupiraReset, null, CURUPIRA_PACKAGE);
    }
}
