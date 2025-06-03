// Struktur awal proyek dengan DDD: domain, application, infrastructure, ui

// DOMAIN - VALUE OBJECT
// Money.java
package catering.domain.shared;

import java.math.BigDecimal;

public class Money {
    private final BigDecimal amount;

    public Money(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Amount cannot be negative");
        this.amount = amount;
    }

    public Money add(Money other) {
        return new Money(this.amount.add(other.amount));
    }

    public Money subtract(Money other) {
        return new Money(this.amount.subtract(other.amount));
    }

    public Money multiply(int multiplier) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(multiplier)));
    }

    public boolean isGreaterOrEqual(Money other) {
        return this.amount.compareTo(other.amount) >= 0;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    @Override
    public String toString() {
        return "Rp " + amount;
    }
}

// DOMAIN - ENTITY
// User.java
package catering.domain.model.user;

import catering.domain.model.order.Order;
import catering.domain.shared.Money;

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

// Food.java
package catering.domain.model.food;

import catering.domain.shared.Money;

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

// Order.java
package catering.domain.model.order;

import catering.domain.model.food.Food;
import catering.domain.shared.Money;

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

// OrderItem.java
package catering.domain.model.order;

import catering.domain.model.food.Food;
import catering.domain.shared.Money;

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

// INFRASTRUCTURE - REPOSITORY
// InMemoryUserRepository.java
package catering.infrastructure.repository;

import catering.domain.model.user.User;

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

// InMemoryFoodRepository.java
package catering.infrastructure.repository;

import catering.domain.model.food.Food;
import catering.domain.shared.Money;

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

// APPLICATION - SERVICE
// UserService.java
package catering.application.service;

import catering.domain.model.user.User;
import catering.domain.shared.Money;
import catering.infrastructure.repository.InMemoryUserRepository;

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

// OrderService.java
package catering.application.service;

import catering.domain.model.food.Food;
import catering.domain.model.order.Order;
import catering.domain.model.user.User;

import java.util.UUID;

public class OrderService {
    public Order createOrder(User user) {
        return new Order(UUID.randomUUID().toString(), user.getUsername());
    }

    public void addOrderToUser(User user, Order order) {
        user.addOrder(order);
    }
}

// FoodService.java
package catering.application.service;

import catering.domain.model.food.Food;
import catering.infrastructure.repository.InMemoryFoodRepository;

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

// UI - Main.java
package catering.ui;

import catering.application.service.*;
import catering.domain.model.food.Food;
import catering.domain.model.order.Order;
import catering.domain.model.user.User;
import catering.domain.shared.Money;
import catering.infrastructure.repository.*;

import java.math.BigDecimal;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        InMemoryUserRepository userRepository = new InMemoryUserRepository();
        InMemoryFoodRepository foodRepository = new InMemoryFoodRepository();

        UserService userService = new UserService(userRepository);
        FoodService foodService = new FoodService(foodRepository);
        OrderService orderService = new OrderService();

        User currentUser = null;

        while (true) {
            System.out.println("1. Register\n2. Login\n3. Exit");
            int choice = Integer.parseInt(scanner.nextLine());

            if (choice == 1) {
                System.out.print("Username: ");
                String username = scanner.nextLine();
                System.out.print("Password: ");
                String password = scanner.nextLine();
                if (userService.register(username, password))
                    System.out.println("Register berhasil!");
                else
                    System.out.println("Username sudah ada!");
            } else if (choice == 2) {
                System.out.print("Username: ");
                String username = scanner.nextLine();
                System.out.print("Password: ");
                String password = scanner.nextLine();
                currentUser = userService.login(username, password);
                if (currentUser != null) break;
                else System.out.println("Login gagal!");
            } else {
                break;
            }
        }

        while (true) {
            System.out.println("\n=== MENU ===");
            System.out.println("1. Lihat Menu\n2. Pesan Makanan\n3. Top Up\n4. Cek Saldo\n5. History Pesanan\n6. Keluar");
            int pilihan = Integer.parseInt(scanner.nextLine());

            if (pilihan == 1) {
                for (Food food : foodService.getAllFood()) {
                    System.out.println(food.getId() + ". " + food.getName() + " - " + food.getPrice());
                }
            } else if (pilihan == 2) {
                Order order = orderService.createOrder(currentUser);
                while (true) {
                    System.out.print("ID Makanan (x untuk selesai): ");
                    String id = scanner.nextLine();
                    if (id.equals("x")) break;
                    Food food = foodService.findFoodById(id);
                    if (food == null) {
                        System.out.println("Makanan tidak ditemukan.");
                        continue;
                    }
                    System.out.print("Jumlah: ");
                    int qty = Integer.parseInt(scanner.nextLine());
                    order.addItem(food, qty);
                }
                Money total = order.getTotalPrice();
                if (currentUser.deductBalance(total)) {
                    orderService.addOrderToUser(currentUser, order);
                    System.out.println("Pesanan berhasil. Total: " + total);
                } else {
                    System.out.println("Saldo tidak cukup. Total: " + total);
                }
            } else if (pilihan == 3) {
                System.out.print("Jumlah Top Up: ");
                BigDecimal topUp = new BigDecimal(scanner.nextLine());
                userService.topUp(currentUser, new Money(topUp));
            } else if (pilihan == 4) {
                System.out.println("Saldo Anda: " + currentUser.getBalance());
            } else if (pilihan == 5) {
                for (Order order : currentUser.getOrderHistory()) {
                    System.out.println("\nPesanan ID: " + order.getOrderId());
                    order.getItems().forEach(i -> System.out.println(i.getFood().getName() + " x" + i.getQuantity()));
                    System.out.println("Total: " + order.getTotalPrice());
                }
            } else {
                break;
            }
        }
        System.out.println("Terima kasih telah menggunakan layanan catering kami!");
    }
}