package com.softawii.saciperere.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softawii.saciperere.request.model.CategoryResponseBody;
import com.softawii.saciperere.request.model.ModelRequestBody;
import com.softawii.saciperere.request.model.ModelResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class ModelUtil {

    public static ModelResponseBody makeQuestion(String question, long category) {
        String modelApiUrl = System.getenv("MODEL_API_URL");
        ObjectMapper mapper = JacksonUtil.MAPPER;
        URI apiURI;
        String questionJson;
        try {
            apiURI = new URI(modelApiUrl + "/question");
            ModelRequestBody modelRequestBody = new ModelRequestBody(question, category);
            questionJson = mapper.writeValueAsString(modelRequestBody);
        } catch (URISyntaxException | JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        HttpRequest.BodyPublisher bodyPublisher = HttpRequest.BodyPublishers.ofString(questionJson);
        HttpRequest request = HttpRequest.newBuilder(apiURI)
            .POST(bodyPublisher)
            .version(HttpClient.Version.HTTP_1_1)
            .setHeader("Content-Type", "application/json")
            .build();
        HttpClient client = HttpClient.newHttpClient();
        try {
            HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
            int statusCode = response.statusCode();
            if (statusCode == 200) {
                //ok
            } else {
                // not ok
            }
            InputStream body = response.body();
            return mapper.readValue(body, ModelResponseBody.class);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
    
    public static CategoryResponseBody[] getCategories() {
        CategoryResponseBody[] categories = (CategoryResponseBody[]) CacheUtil.CACHE.get("categories", s -> {
            System.out.println("Populando categorias");
            String modelApiUrl = System.getenv("MODEL_API_URL");
            ObjectMapper mapper = JacksonUtil.MAPPER;
            URI apiURI;
            try {
                apiURI = new URI(modelApiUrl + "/categories");
            } catch (URISyntaxException e) {
                throw new RuntimeException(e);
            }
            HttpRequest request = HttpRequest.newBuilder(apiURI)
                .GET()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
            HttpClient client = HttpClient.newHttpClient();
            try {
                HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
                int statusCode = response.statusCode();
                if (statusCode == 200) {
                    //ok
                } else {
                    // not ok
                }
                InputStream body = response.body();
                return mapper.readValue(body, CategoryResponseBody[].class);
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        
        return categories;
    }
    
}
