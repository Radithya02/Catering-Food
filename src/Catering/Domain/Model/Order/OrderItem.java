package Catering.Domain.Model.Order;

import Catering.Domain.Model.Food.Food;
import Catering.Domain.Shared.Money;

public class OrderItem {
    private final Food food;
    private final int quantity;

    public OrderItem(Food food, int quantity) {
        this.food = food;
        this.quantity = quantity;
    }

    public Money getSubtotal() {
        return food.getPrice().multiply(quantity);
    }

    public Food getFood() {
        return food;
    }

    public int getQuantity() {
        return quantity;
    }
}
