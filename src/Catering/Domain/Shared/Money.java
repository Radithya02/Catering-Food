package Catering.Domain.Shared;

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