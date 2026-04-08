package com.beachhotel;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    @GetMapping("/rooms")
    public String rooms() {
        return "forward:/rooms.html";
    }

    @GetMapping("/menu")
    public String menu() {
        return "forward:/menu.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "forward:/admin.html";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/login.html";
    }
}
