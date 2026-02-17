package com.example.demo.shared.exception;

public class AccountDisabledException extends RuntimeException {
    public AccountDisabledException(String message) {
        super(message);
    }
}
