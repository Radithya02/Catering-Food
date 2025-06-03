package Catering.Domain.Model.User;

import Catering.Domain.Model.Order.Order;
import Catering.Domain.Shared.Money;

import java.util.ArrayList;
import java.util.List;

public class User {
    private final String username;
    private final String password;
    private Money balance;
    private List<Order> orderHistory;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.balance = new Money(java.math.BigDecimal.ZERO);
        this.orderHistory = new ArrayList<>();
    }

    public void topUp(Money amount) {
        this.balance = this.balance.add(amount);
    }

    public boolean deductBalance(Money amount) {
        if (balance.isGreaterOrEqual(amount)) {
            this.balance = this.balance.subtract(amount);
            return true;
        }
        return false;
    }

    public void addOrder(Order order) {
        orderHistory.add(order);
    }

    public List<Order> getOrderHistory() {
        return orderHistory;
    }

    public Money getBalance() {
        return balance;
    }

    public String getUsername() {
        return username;
    }

    public boolean checkPassword(String inputPassword) {
        return this.password.equals(inputPassword);
    }
}