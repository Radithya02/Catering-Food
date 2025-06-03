package Catering.Application.Service;

import Catering.Domain.Model.Food.Food;
import Catering.Domain.Model.Order.Order;
import Catering.Domain.Model.User.User;

import java.util.UUID;

public class OrderService {
    public Order createOrder(User user) {
        return new Order(UUID.randomUUID().toString(), user.getUsername());
    }

    public void addOrderToUser(User user, Order order) {
        user.addOrder(order);
    }
}

