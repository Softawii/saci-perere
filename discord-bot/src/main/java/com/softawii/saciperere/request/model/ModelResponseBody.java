package com.softawii.saciperere.request.model;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.DoubleNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

import java.io.IOException;

public record ModelResponseBody(
    String userQuestion,
    String question,
    String answer,
    long questionId,
    long historyId,
    double score,
    QuestionHit[] hits
) {
    public static class ModelResponseDeserializer extends StdDeserializer<ModelResponseBody> {

        public ModelResponseDeserializer() {
            super((Class<?>) null);
        }

        public ModelResponseDeserializer(Class<?> vc) {
            super(vc);
        }

        @Override
        public ModelResponseBody deserialize(JsonParser jp, DeserializationContext ctx) throws IOException, JacksonException {
            TreeNode node = jp.getCodec().readTree(jp);
            String userQuestion = node.get("user_question").toString();
            String question = node.get("question").toString().replaceAll("\\\\r\\\\n|\\\\n", "\n").replaceAll("^\"|\"$", "");
            String answer = node.get("answer").toString().replaceAll("\\\\r\\\\n|\\\\n", "\n").replaceAll("^\"|\"$", "");
            long questionId = ((IntNode) node.get("question_id")).longValue();
            long historyId = ((IntNode) node.get("history_id")).longValue();
            double score = ((DoubleNode) node.get("score")).doubleValue();
            ObjectMapper mapper = new ObjectMapper();
            QuestionHit[] hits = mapper.readValue(node.get("hits").traverse(), QuestionHit[].class);

            return new ModelResponseBody(userQuestion, question, answer, questionId, historyId, score, hits);
        }
    }
}

