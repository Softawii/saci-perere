package com.softawii.saciperere.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softawii.saciperere.request.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ModelUtil {

    public static ModelResponseBody makeQuestion(String question, long category) {
        String modelApiUrl = System.getenv("MODEL_API_URL");
        ObjectMapper mapper = JacksonUtil.MAPPER;
        URI apiURI;
        String questionJson;
        try {
            apiURI = new URI(modelApiUrl + "/question");
            ModelRequestBody modelRequestBody = new ModelRequestBody(question, category, "discord");
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

    public static CategoryResponseBody[] getCategories(long id) {
        CategoryResponseBody[] categories = (CategoryResponseBody[]) CacheUtil.CACHE.get("categories-" + id, s -> {
            System.out.println("Populando categoria: " + id);
            String modelApiUrl = System.getenv("MODEL_API_URL");
            ObjectMapper mapper = JacksonUtil.MAPPER;
            URI apiURI;
            try {
                apiURI = new URI(modelApiUrl + "/categories/" + id);
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

    public static TopicResponseBody[] getTopics() {
        TopicResponseBody[] categories = (TopicResponseBody[]) CacheUtil.CACHE.get("topics", s -> {
            System.out.println("Populando tópicos");
            String modelApiUrl = System.getenv("MODEL_API_URL");
            ObjectMapper mapper = JacksonUtil.MAPPER;
            URI apiURI;
            try {
                apiURI = new URI(modelApiUrl + "/topics");
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
                return mapper.readValue(body, TopicResponseBody[].class);
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
        });

        return categories;
    }

    public static void saveFeedback(long history, int status, String userFeedback) {
        String modelApiUrl = System.getenv("MODEL_API_URL");
        ObjectMapper mapper = JacksonUtil.MAPPER;
        URI apiURI;
        String questionJson;
        try {
            apiURI = new URI(modelApiUrl + "/give-feedback");
            FeedbackRequestBody feedbackRequestBody = new FeedbackRequestBody(history, status, userFeedback);
            questionJson = mapper.writeValueAsString(feedbackRequestBody);
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
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
