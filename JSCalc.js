var Application = {};

(function() {

    Application.init = init;

    function init() {
        var answer = { s: 0 };

        $(".equalitySign").click(function() {
            compute();
        });

        $('.printed').click(function() {
            var value = $("#input").val();
            $("#input").val(value + $(this).html());
            clear();
        });

        $('.backSpace').click(function() {
            var value = $("#input").val();
            value = value.substring(0, value.length - 1);
            $("#input").val(value);
        });

        $('.refresh').click(function() {
            $("#input").val('');
        });

        function compute() {
            var expression = $("#input").val();
            expression = expression.replace(/\s+/g, '');
            var expr = { val: expression };
            computeExpression(expr, answer);
            $("#input").val(answer.s);
            answer.s = 0;
        }

        function computeExpression(expression, answer) {
            if (expression.val === '') return;
            var rightOperand = 0;
            if (!isNaN(expression.val[0])) {
                rightOperand = expression.val.match(/[0-9.]+/)[0];
                expression.val = expression.val.split('').splice(rightOperand.length).join('');
                answer.s = applyOperator(answer.s, rightOperand, '+');
            } else if (['*', '-', '/', '+'].includes(expression.val[0])) {
                var operator = expression.val.split('').splice(0)[0];
                expression.val = expression.val.split('').splice(1).join('');
                if (expression.val[0] == '(') {
                    var leftParenthesisCalculated = { s: 0 };
                    getParenthesis1(expression, leftParenthesisCalculated, computeExpression);
                    rightOperand = leftParenthesisCalculated.s;
                } else {
                    rightOperand = expression.val.match(/[0-9.]+/)[0];
                }
                expression.val = expression.val.split('').splice(rightOperand.length).join('');

                if (expression.val[0] == '*' || expression.val[0] == '/') {

                    while (true) {
                        if (expression.val === '') break;
                        var nextOperator = expression.val.split('').splice(0)[0];
                        if (expression.val[0] == '-' || expression.val[0] == '+') { break; }
                        expression.val = expression.val.split('').splice(1).join('');
                        if (expression.val[0] == '(') {
                            var rightParenthesisCalculated = { s: 0 };
                            getParenthesis1(expression, rightParenthesisCalculated, computeExpression);
                            rightOperand = applyOperator(rightOperand, rightParenthesisCalculated.s, nextOperator);
                        } else {
                            var nextOperand = expression.val.match(/[0-9.]+/)[0];
                            expression.val = expression.val.split('').splice(nextOperand.length).join('');
                            rightOperand = applyOperator(rightOperand, nextOperand, nextOperator);
                        }
                    }
                }
                answer.s = applyOperator(answer.s, rightOperand, operator);
            } else if (expression.val[0] == '(') {
                getParenthesis1(expression, answer, computeExpression);
            }
            computeExpression(expression, answer);
        }

        function getParenthesis1(expression, answer, cb) {
            var tempExpression = expression.val.split('');
            var ind = 0;
            var array = ['(']
            for (var i = 1; i < tempExpression.length; i++) {
                if (tempExpression[i] == '(') {
                    array.push(tempExpression[i]);
                } else if (tempExpression[i] == ')') {
                    array.pop();
                }
                ind = i;
                if (array.length === 0) break;
            }
            expression.val = tempExpression.splice(ind + 1).join('');
            cb({ val: tempExpression.slice(1, ind).join('') }, answer);
        }

        function applyOperator(left, right, op) {
            left = parseFloat(left);
            right = parseFloat(right);
            switch (op) {
                case '+':
                    return left + right;
                case '-':
                    return left - right;
                case '/':
                    return left / right;
                case '*':
                    return left * right;
            }
        }
    }



})(Application, $);