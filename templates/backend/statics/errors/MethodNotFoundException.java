package com.ecovinal.industria.errors;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.web.server.ResponseStatusException;

public class MethodNotFoundException extends ResponseStatusException {
    /**
     * Constructor with a response status and a reason to add to the exception
     * message as explanation. Status NOT FOUND 404
     * @param reason the associated reason (optional)
     */
    public MethodNotFoundException(@Nullable String reason) {
        super(HttpStatus.NOT_FOUND, reason, null);
    }
}
