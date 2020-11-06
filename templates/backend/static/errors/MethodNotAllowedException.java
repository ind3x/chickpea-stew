package com.garbando.package.errors;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.web.server.ResponseStatusException;

public class MethodNotAllowedException extends ResponseStatusException {
    /**
     * Constructor with a response status and a reason to add to the exception
     * message as explanation. Status METHOD NOT ALLOWED 405
     * @param reason the associated reason (optional)
     */
    public MethodNotAllowedException(@Nullable String reason) {
        super(HttpStatus.METHOD_NOT_ALLOWED, reason, null);
    }
}
