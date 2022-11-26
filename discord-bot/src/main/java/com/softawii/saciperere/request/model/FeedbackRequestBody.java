package com.softawii.saciperere.request.model;

public record FeedbackRequestBody(
    long history,
    int status,
    String user_feedback
) {}
