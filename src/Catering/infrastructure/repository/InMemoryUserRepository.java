package Catering.infrastructure.repository;

import Catering.Domain.Model.User.User;

import java.util.HashMap;
import java.util.Map;

public class InMemoryUserRepository {
    private final Map<String, User> users = new HashMap<>();

    public void save(User user) {
        users.put(user.getUsername(), user);
    }

    public User findByUsername(String username) {
        return users.get(username);
    }
}