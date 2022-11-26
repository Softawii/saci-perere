package com.softawii.saciperere.request.model;

public record ModelRequestBody(
    String question,
    long category,
    String platform
) {}
