package Catering.Ui;

import Catering.Application.Service.*;
import Catering.Domain.Model.Food.Food;
import Catering.Domain.Model.Order.Order;
import Catering.Domain.Model.User.User;
import Catering.Domain.Shared.Money;
import Catering.infrastructure.repository.*;

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