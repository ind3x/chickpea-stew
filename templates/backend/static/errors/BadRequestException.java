package com.garbando.package.errors;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.web.server.ResponseStatusException;

public class BadRequestException extends ResponseStatusException {
    /**
     * Constructor with a response status and a reason to add to the exception
     * message as explanation. Status BAD REQUEST 400
     * @param reason the associated reason (optional)
     */
    public BadRequestException(@Nullable String reason) {
        super(HttpStatus.BAD_REQUEST, reason, null);
    }
}
