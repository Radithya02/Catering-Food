package Catering.Domain.Model.Order;

import Catering.Domain.Model.Food.Food;
import Catering.Domain.Shared.Money;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Order {
    private final String orderId;
    private final String userId;
    private final LocalDateTime orderDate;
    private final List<OrderItem> items;

    public Order(String orderId, String userId) {
        this.orderId = orderId;
        this.userId = userId;
        this.orderDate = LocalDateTime.now();
        this.items = new ArrayList<>();
    }

    public void addItem(Food food, int quantity) {
        items.add(new OrderItem(food, quantity));
    }

    public Money getTotalPrice() {
        return items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(new Money(java.math.BigDecimal.ZERO), Money::add);
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public String getOrderId() {
        return orderId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }
}