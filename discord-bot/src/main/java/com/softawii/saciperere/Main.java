package com.softawii.saciperere;

import com.softawii.saciperere.util.JDAUtil;
import com.softawii.saciperere.util.ModelUtil;

import javax.security.auth.login.LoginException;

public class Main {
    public static void main(String[] args) throws LoginException, InterruptedException {
//        System.out.println(ModelUtil.makeQuestion("quanto se gastou em publicidade ano a ano?", 8));
        JDAUtil.initJDA();
    }
}
