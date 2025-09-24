package com.example.negocio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ShutdownController {
    private ConfigurableApplicationContext context;

    @PostMapping("/shutdownApp")
    public void shutdownApp() {
        new Thread(() -> context.close()).start();
    }
}
