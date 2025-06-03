package Catering.Application.Service;

import Catering.Domain.Model.Food.Food;
import Catering.Domain.Shared.Money;
import Catering.Domain.Model.User.User;
import Catering.infrastructure.repository.InMemoryUserRepository;

public class UserService {
    private final InMemoryUserRepository userRepository;

    public UserService(InMemoryUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean register(String username, String password) {
        if (userRepository.findByUsername(username) != null) return false;
        userRepository.save(new User(username, password));
        return true;
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        return (user != null && user.checkPassword(password)) ? user : null;
    }

    public void topUp(User user, Money amount) {
        user.topUp(amount);
    }

    public boolean checkBalance(User user, Money amount) {
        return user.getBalance().isGreaterOrEqual(amount);
    }
}

