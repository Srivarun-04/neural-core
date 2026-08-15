import ast
import math
import re
import operator
from typing import Union, Dict, Any
from langchain_core.tools import tool

ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

ALLOWED_FUNCTIONS: Dict[str, Any] = {
    "sqrt": math.sqrt,
    "abs": abs,
    "round": round,
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "log": math.log,
    "log10": math.log10,
    "exp": math.exp,
    "ceil": math.ceil,
    "floor": math.floor,
    "factorial": math.factorial,
    "pi": math.pi,
    "e": math.e,
}

def preprocess_math_expression(expr: str) -> str:
    """
    Cleans and standardizes mathematical expressions:
    - Converts caret (^) to exponentiation (**)
    - Converts 'X% of Y' to '(X / 100) * Y'
    - Converts 'X%' to '(X / 100)'
    - Handles simple time conversions (e.g., 'X hours to minutes' -> 'X * 60')
    """
    expr = expr.strip()
    
    # Unit conversions (time / days / etc.)
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:to|in|into)\s*(?:minutes?|mins?)', r'(\1 * 60)', expr, flags=re.IGNORECASE)
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)\s*(?:to|in|into)\s*(?:seconds?|secs?)', r'(\1 * 60)', expr, flags=re.IGNORECASE)
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*(?:days?)\s*(?:to|in|into)\s*(?:hours?|hrs?)', r'(\1 * 24)', expr, flags=re.IGNORECASE)
    
    # Handle 'X% of Y' -> (X / 100) * Y
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)', r'((\1 / 100) * \2)', expr, flags=re.IGNORECASE)
    
    # Handle 'X% * Y' or 'X% + Y' etc.
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*%\s*([*+\-/])', r'(\1 / 100) \2', expr)

    # Handle trailing percentage 'X%' at end of expression or before closing parenthesis
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*%(?=\s*[\)|$])', r'(\1 / 100)', expr)
    
    # Replace '^' with '**'
    expr = expr.replace('^', '**')
    
    # Strip unnecessary natural language wrappers if any
    expr = re.sub(r'^(?:calculate|what is|compute|evaluate)\s*', '', expr, flags=re.IGNORECASE)
    expr = expr.strip(' ?=')
    
    return expr

def evaluate_ast_node(node: ast.AST) -> Union[int, float]:
    """
    Recursively and safely evaluates an AST node.
    Raises ValueError on any disallowed node types.
    """
    if isinstance(node, ast.Expression):
        return evaluate_ast_node(node.body)
        
    elif isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Unsupported constant type: {type(node.value)}")
        
    elif isinstance(node, ast.BinOp):
        left = evaluate_ast_node(node.left)
        right = evaluate_ast_node(node.right)
        op_type = type(node.op)
        if op_type in ALLOWED_OPERATORS:
            if op_type in (ast.Div, ast.FloorDiv, ast.Mod) and right == 0:
                raise ZeroDivisionError("Division or modulo by zero.")
            # Safeguard large powers
            if op_type == ast.Pow:
                if left > 1000000 or right > 1000:
                    raise ValueError("Power exponent or base is too large.")
            return ALLOWED_OPERATORS[op_type](left, right)
        raise ValueError(f"Disallowed binary operator: {op_type.__name__}")
        
    elif isinstance(node, ast.UnaryOp):
        operand = evaluate_ast_node(node.operand)
        op_type = type(node.op)
        if op_type in ALLOWED_OPERATORS:
            return ALLOWED_OPERATORS[op_type](operand)
        raise ValueError(f"Disallowed unary operator: {op_type.__name__}")
        
    elif isinstance(node, ast.Call):
        if not isinstance(node.func, ast.Name):
            raise ValueError("Unsupported function call target.")
        func_name = node.func.id.lower()
        if func_name not in ALLOWED_FUNCTIONS:
            raise ValueError(f"Disallowed function: '{func_name}'.")
        
        evaluated_args = [evaluate_ast_node(arg) for arg in node.args]
        func = ALLOWED_FUNCTIONS[func_name]
        if callable(func):
            return func(*evaluated_args)
        return func
        
    elif isinstance(node, ast.Name):
        var_name = node.id.lower()
        if var_name in ALLOWED_FUNCTIONS and not callable(ALLOWED_FUNCTIONS[var_name]):
            return ALLOWED_FUNCTIONS[var_name]
        raise ValueError(f"Disallowed identifier or variable: '{node.id}'")
        
    else:
        raise ValueError(f"Unsupported syntax construct: {type(node).__name__}")

def safe_calculate(expression: str) -> str:
    """
    Safely parses and computes mathematical expressions using an AST evaluator.
    Never uses eval() or exec().
    """
    try:
        clean_expr = preprocess_math_expression(expression)
        if not clean_expr:
            return "Error: Empty expression provided."
        
        parsed_tree = ast.parse(clean_expr, mode='eval')
        result = evaluate_ast_node(parsed_tree)
        
        # Format integer results cleanly without trailing '.0' if exact
        if isinstance(result, float) and result.is_integer():
            result = int(result)
            
        return f"{result}"
    except ZeroDivisionError:
        return "Error: Division or modulo by zero is undefined."
    except SyntaxError:
        return f"Error: Invalid mathematical syntax in '{expression}'."
    except Exception as e:
        return f"Error evaluating expression: {str(e)}"

@tool
def calculator_tool(expression: str) -> str:
    """
    Perform safe and precise mathematical calculations, arithmetic operations,
    percentages (e.g. '18% of 75000'), powers, square roots, and unit conversions (e.g. '5 hours into minutes').
    Input should be a mathematical expression or arithmetic query string.
    """
    return safe_calculate(expression)
