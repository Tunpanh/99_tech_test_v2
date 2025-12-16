var sum_to_n_a = function(n) {
    // Implementation 1: Iterative (Loop)
    // Time Complexity: O(n)
    // Space Complexity: O(1)
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    // Implementation 2: Mathematical Formula (Arithmetic Progression)
    // Time Complexity: O(1)
    // Space Complexity: O(1)
    return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) {
    // Implementation 3: Recursive
    // Time Complexity: O(n)
    // Space Complexity: O(n) due to recursion stack
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};

// Verification / Test cases
console.log("sum_to_n_a(5):", sum_to_n_a(5)); // Expected: 15
console.log("sum_to_n_b(5):", sum_to_n_b(5)); // Expected: 15
console.log("sum_to_n_c(5):", sum_to_n_c(5)); // Expected: 15

console.log("sum_to_n_a(10):", sum_to_n_a(10)); // Expected: 55
console.log("sum_to_n_b(10):", sum_to_n_b(10)); // Expected: 55
console.log("sum_to_n_c(10):", sum_to_n_c(10)); // Expected: 55
