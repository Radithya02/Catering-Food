package Catering.Domain.Model.Food;

import Catering.Domain.Shared.Money;

public class Food {
    private final String id;
    private final String name;
    private final String description;
    private final Money price;

    public Food(String id, String name, String description, Money price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    public Money getPrice() {
        return price;
    }

    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }
}
