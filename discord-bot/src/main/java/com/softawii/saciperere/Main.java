package com.softawii.saciperere;

import com.softawii.saciperere.util.JDAUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import javax.security.auth.login.LoginException;

@SpringBootApplication
public class Main {
    public static ApplicationContext applicationContext;
    
    public static void main(String[] args) throws LoginException, InterruptedException {
        applicationContext = SpringApplication.run(Main.class, args);
        JDAUtil.initJDA();
    }
}
