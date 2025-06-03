package Catering.infrastructure.repository;

import Catering.Domain.Model.Food.Food;
import Catering.Domain.Shared.Money;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class InMemoryFoodRepository {
    private final List<Food> foods = new ArrayList<>();

    public InMemoryFoodRepository() {
        foods.add(new Food("1", "Nasi Goreng", "Nasi goreng pedas", new Money(new BigDecimal("15000"))));
        foods.add(new Food("2", "Ayam Bakar", "Ayam bakar manis", new Money(new BigDecimal("20000"))));
        foods.add(new Food("3", "Es Teh", "Minuman dingin segar", new Money(new BigDecimal("5000"))));
    }

    public List<Food> findAll() {
        return foods;
    }

    public Food findById(String id) {
        return foods.stream().filter(f -> f.getId().equals(id)).findFirst().orElse(null);
    }
}