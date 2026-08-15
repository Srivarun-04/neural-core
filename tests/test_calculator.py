import unittest
from backend.tools.calculator_tool import safe_calculate, calculator_tool

class TestCalculatorTool(unittest.TestCase):
    def test_basic_arithmetic(self):
        self.assertEqual(safe_calculate("38274 * 284"), "10869816")
        self.assertEqual(safe_calculate("100 + 250"), "350")
        self.assertEqual(safe_calculate("1000 - 450"), "550")
        self.assertEqual(safe_calculate("100 / 4"), "25")
        self.assertEqual(safe_calculate("10 // 3"), "3")
        self.assertEqual(safe_calculate("10 % 3"), "1")

    def test_percentages(self):
        # 18% of 75000 = 13500
        self.assertEqual(safe_calculate("18% of 75000"), "13500")
        self.assertEqual(safe_calculate("50% of 200"), "100")
        self.assertEqual(safe_calculate("Calculate 25% of 80"), "20")

    def test_powers_and_functions(self):
        self.assertEqual(safe_calculate("2 ^ 8"), "256")
        self.assertEqual(safe_calculate("2 ** 10"), "1024")
        self.assertEqual(safe_calculate("sqrt(144)"), "12")
        self.assertEqual(safe_calculate("abs(-42)"), "42")
        self.assertEqual(safe_calculate("round(3.14159, 2)"), "3.14")
        self.assertEqual(safe_calculate("factorial(5)"), "120")

    def test_unit_conversions(self):
        self.assertEqual(safe_calculate("5 hours into minutes"), "300")
        self.assertEqual(safe_calculate("2 hours to minutes"), "120")
        self.assertEqual(safe_calculate("3 days to hours"), "72")
        self.assertEqual(safe_calculate("90 minutes to seconds"), "5400")

    def test_division_by_zero(self):
        result = safe_calculate("100 / 0")
        self.assertIn("Division or modulo by zero", result)

    def test_security_and_injection_prevention(self):
        # Disallow arbitrary imports, function calls, attributes
        unsafe_payloads = [
            "__import__('os').system('ls')",
            "open('test.txt', 'w')",
            "exec('a = 1')",
            "eval('1+1')",
            "globals()",
            "locals()",
            "__builtins__"
        ]
        for payload in unsafe_payloads:
            res = safe_calculate(payload)
            self.assertTrue(res.startswith("Error"), f"Failed to block unsafe payload: {payload}")

    def test_langchain_tool_wrapper(self):
        res = calculator_tool.invoke({"expression": "15 * 6"})
        self.assertEqual(res, "90")

if __name__ == "__main__":
    unittest.main()
