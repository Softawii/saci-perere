package com.softawii.saciperere.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.softawii.saciperere.request.model.ModelResponseBody;

public class JacksonUtil {
    public static final ObjectMapper MAPPER;

    static {
        MAPPER = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addDeserializer(ModelResponseBody.class, new ModelResponseBody.ModelResponseDeserializer());
        MAPPER.registerModule(module);
    }
}
