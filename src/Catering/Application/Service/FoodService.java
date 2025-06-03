package Catering.Application.Service;

import Catering.Domain.Model.Food.Food;
import Catering.infrastructure.repository.InMemoryFoodRepository;

import java.util.List;

public class FoodService {
    private final InMemoryFoodRepository foodRepository;

    public FoodService(InMemoryFoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<Food> getAllFood() {
        return foodRepository.findAll();
    }

    public Food findFoodById(String id) {
        return foodRepository.findById(id);
    }
}
