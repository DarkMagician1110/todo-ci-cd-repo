/**
 * CI/CD Failure Scenarios Tests
 * Mô phỏng các lỗi thực tế sẽ làm fail CI/CD pipeline
 */

describe('💥 CI/CD Failure Scenarios', () => {

    // ==================== SCENARIO 1: LINT FAILURES ====================
    describe('🔴 Scenario 1: Code Lint Failures', () => {

        it('Should fail when unused variable detected', () => {
            // Mô phỏng code xấu
            const requiresLinting = `
const express = require('express');
const mongoose = require('mongoose');  // ❌ Không sử dụng
const app = express();

app.listen(3000);
            `;

            // Test phát hiện unused
            expect(requiresLinting).toContain('mongoose');
            console.log('❌ LINT FAIL: Unused import detected');
        });

        it('Should fail with inconsistent spacing', () => {
            const badSpacing = `
const x=1;  // ❌ Không có space quanh =
function test( param ){  // ❌ Space thừa
    return param  ;  // ❌ Space trước ;
}
            `;
            
            expect(badSpacing).toMatch(/const x=1/);
            console.log('❌ LINT FAIL: Inconsistent spacing');
        });

        it('Should fail with no semicolons', () => {
            const noSemicolons = `
const obj = {
    name: "test",  // ❌ Thiếu ;
    value: 123     // ❌ Thiếu ;
}
            `;

            expect(noSemicolons).not.toContain('};');
            console.log('❌ LINT FAIL: Missing semicolons');
        });

        it('Should fail with mixed quotes', () => {
            const mixedQuotes = `
const str1 = "double quotes";
const str2 = 'single quotes';  // ❌ Không nhất quán
const str3 = "more double";
            `;

            expect(mixedQuotes).toContain("'single");
            console.log('❌ LINT FAIL: Mixed quote style');
        });
    });

    // ==================== SCENARIO 2: TEST FAILURES ====================
    describe('🔴 Scenario 2: Unit Test Failures', () => {

        it('Should fail when createTodo accepts empty string', () => {
            // Simulate bad controller
            const badController = {
                createTodo: async (req, res) => {
                    // ❌ No validation for empty title
                    const todo = { id: 1, title: req.body.title };
                    res.status(201).json(todo);
                }
            };

            const req = { body: { title: "" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            badController.createTodo(req, res);

            // Should have failed validation but didn't
            expect(res.status).toHaveBeenCalledWith(201);
            console.log('❌ TEST FAIL: Empty title accepted');
        });

        it('Should fail when getAllTodos returns wrong type', () => {
            const badController = {
                getAllTodos: async (req, res) => {
                    // ❌ Returns string instead of array
                    res.status(200).json("todos");
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            badController.getAllTodos({}, res);
            const result = res.json.mock.calls[0][0];

            expect(typeof result).toBe('string');
            console.log('❌ TEST FAIL: getAllTodos returns string instead of array');
        });

        it('Should fail when deleteTodo has wrong status code', () => {
            const badController = {
                deleteTodo: async (req, res) => {
                    // ❌ Returns 201 instead of 200
                    res.status(201).json({ message: "Deleted" });
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            badController.deleteTodo({ params: { id: 1 } }, res);

            expect(res.status).toHaveBeenCalledWith(201);
            console.log('❌ TEST FAIL: Wrong status code (201 instead of 200)');
        });

        it('Should fail when error handling missing', () => {
            const badController = {
                createTodo: async (req, res) => {
                    // ❌ No try-catch or error handling
                    const todo = { title: req.body.title };
                    res.status(201).json(todo);
                }
            };

            expect(() => {
                badController.createTodo({}, {
                    status: () => ({
                        json: () => {}
                    })
                });
            }).not.toThrow();
            console.log('❌ TEST FAIL: Missing error handling');
        });

        it('Should fail on null pointer exception', () => {
            const badController = {
                updateTodo: async (req, res) => {
                    // ❌ Accessing null object without check
                    const title = req.body.title.toUpperCase();
                    res.status(200).json({ title });
                }
            };

            const req = { body: { title: null } };
            expect(() => req.body.title.toUpperCase()).toThrow();
            console.log('❌ TEST FAIL: Null pointer exception');
        });
    });

    // ==================== SCENARIO 3: INTEGRATION TEST FAILURES ====================
    describe('🔴 Scenario 3: Integration Test Failures', () => {

        it('Should fail when response has missing required fields', () => {
            const invalidResponse = {
                data: { id: 1 },
                // ❌ Missing: statusCode, message, success
            };

            expect(invalidResponse).not.toHaveProperty('statusCode');
            console.log('❌ INTEGRATION FAIL: Missing required response fields');
        });

        it('Should fail when request times out', async () => {
            const slowFunction = new Promise(resolve => {
                setTimeout(() => resolve('done'), 5000); // 5 seconds
            });

            const maxWait = 1000; // 1 second timeout
            let timedOut = false;

            await Promise.race([
                slowFunction,
                new Promise((_, reject) => 
                    setTimeout(() => {
                        timedOut = true;
                        reject(new Error('Timeout'));
                    }, maxWait)
                )
            ]).catch(() => {});

            expect(timedOut).toBe(true);
            console.log('❌ INTEGRATION FAIL: Request timeout (5s > 1s limit)');
        });

        it('Should fail with incorrect error response format', () => {
            // ❌ Error response missing proper structure
            const errorResponse = {
                error: "Something went wrong"
                // Missing: statusCode, errorCode, details
            };

            expect(errorResponse).not.toHaveProperty('statusCode');
            console.log('❌ INTEGRATION FAIL: Incorrect error response format');
        });

        it('Should fail when database connection fails', async () => {
            const badDbConnection = {
                connect: async () => {
                    throw new Error('Cannot connect to MongoDB');
                }
            };

            let connectionFailed = false;
            try {
                await badDbConnection.connect();
            } catch (error) {
                connectionFailed = true;
            }

            expect(connectionFailed).toBe(true);
            console.log('❌ INTEGRATION FAIL: Database connection error');
        });
    });

    // ==================== SCENARIO 4: FRONTEND BUILD FAILURES ====================
    describe('🔴 Scenario 4: Frontend Build Failures', () => {

        it('Should fail when HTML has unclosed tags', () => {
            const brokenHTML = `
<html>
<head><title>Todo App</title></head>
<body>
    <div>
        <h1>My Todos</h1>
        <ul>
            <li>Todo 1
        </div>  <!-- ❌ Mismatch closing tag -->
    </li>
</body>
</html>
            `;

            const hasUnclosedTags = !brokenHTML.includes('</li>');
            expect(hasUnclosedTags).toBe(true);
            console.log('❌ FRONTEND FAIL: Unclosed HTML tags');
        });

        it('Should fail when CSS has syntax errors', () => {
            const brokenCSS = `
.todo-item {
    padding: 10px
    margin: 5px;  /* ❌ Missing ; before this */
    color: red
}

#header {
    background: blue
    font-size: 20px /* ❌ Missing ; */
}
            `;

            const hasSyntaxErrors = !brokenCSS.includes('padding: 10px;');
            expect(hasSyntaxErrors).toBe(true);
            console.log('❌ FRONTEND FAIL: CSS syntax errors');
        });

        it('Should fail when JavaScript has syntax error', () => {
            const brokenJS = `
function addTodo() {
    const title = document.getElementById('input').value
    const list = document.getElementById('list'
    const item = document.createElement('li');
    item.textContent = title
}
            `;

            const hasSyntaxError = !brokenJS.includes('getElementById(\'list\')');
            expect(hasSyntaxError).toBe(true);
            console.log('❌ FRONTEND FAIL: JavaScript syntax error');
        });

        it('Should fail when referenced files missing', () => {
            const htmlWithMissingRef = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles.css">
    <script src="missing-file.js"></script>  <!-- ❌ File not found -->
</head>
</html>
            `;

            const hasMissingReference = htmlWithMissingRef.includes('missing-file.js');
            expect(hasMissingReference).toBe(true);
            console.log('❌ FRONTEND FAIL: Missing referenced file');
        });
    });

    // ==================== SCENARIO 5: DEPENDENCY FAILURES ====================
    describe('🔴 Scenario 5: Dependency Failures', () => {

        it('Should fail with version incompatibility', () => {
            const packageJson = {
                dependencies: {
                    express: "^3.0.0",  // ❌ Too old version
                    cors: "^2.8.5"
                },
                engines: {
                    node: ">=16.0.0"
                }
            };

            const expressMajor = parseInt(packageJson.dependencies.express.split('.')[0]);
            expect(expressMajor).toBeLessThan(4);
            console.log('❌ DEPENDENCY FAIL: Express version too old');
        });

        it('Should fail with missing required dependency', () => {
            const badPackageJson = {
                dependencies: {
                    cors: "^2.8.5"
                    // ❌ Missing express
                },
                devDependencies: {
                    // ❌ Missing jest
                }
            };

            expect(badPackageJson.dependencies).not.toHaveProperty('express');
            console.log('❌ DEPENDENCY FAIL: Missing express');
        });

        it('Should fail with incompatible Node version', () => {
            const tooOldNode = "v12.0.0";
            const majorVersion = parseInt(tooOldNode.split('.')[0].substring(1));

            expect(majorVersion).toBeLessThan(16);
            console.log('❌ NODE VERSION FAIL: Node 12 < minimum 16');
        });
    });

    // ==================== SCENARIO 6: SECURITY FAILURES ====================
    describe('🔴 Scenario 6: Security Failures', () => {

        it('Should fail with hardcoded credentials', () => {
            const badCode = `
const dbPassword = "super_secret_password_123";
const apiKey = "sk-1234567890abcdef";
const dbUrl = "mongodb://user:pass@localhost:27017/db";
            `;

            expect(badCode).toContain('super_secret_password');
            console.log('❌ SECURITY FAIL: Hardcoded credentials found');
        });

        it('Should fail with SQL injection vulnerability', () => {
            const vulnerableCode = `
const userId = req.params.id;
const query = "SELECT * FROM users WHERE id = " + userId;
            `;

            expect(vulnerableCode).toContain('WHERE id = " + userId');
            console.log('❌ SECURITY FAIL: SQL injection vulnerability');
        });

        it('Should fail with XSS vulnerability', () => {
            const xssVulnerablCode = `
const userInput = req.body.comment;
document.getElementById('comments').innerHTML = userInput;  // ❌ XSS!
            `;

            expect(xssVulnerablCode).toContain('innerHTML = userInput');
            console.log('❌ SECURITY FAIL: XSS vulnerability');
        });
    });

    // ==================== SCENARIO 7: COVERAGE FAILURES ====================
    describe('🔴 Scenario 7: Code Coverage Failures', () => {

        it('Should fail when coverage below threshold', () => {
            const lowCoverage = {
                lines: 45,
                statements: 50,
                functions: 35,
                branches: 25,
                threshold: 70
            };

            const average = (lowCoverage.lines + lowCoverage.statements + 
                            lowCoverage.functions + lowCoverage.branches) / 4;

            expect(average).toBeLessThan(lowCoverage.threshold);
            console.log(`❌ COVERAGE FAIL: ${average.toFixed(2)}% < 70% threshold`);
        });

        it('Should fail when untested files exist', () => {
            const coverage = {
                'controllers/todoController.js': 85,
                'models/Todo.js': 0,  // ❌ No tests
                'routes/todoRoutes.js': 50
            };

            const untested = Object.entries(coverage)
                .filter(([, cov]) => cov === 0)
                .map(([file]) => file);

            expect(untested.length).toBeGreaterThan(0);
            console.log(`❌ COVERAGE FAIL: Untested files: ${untested.join(', ')}`);
        });
    });
});

// ==================== FAILURE SUMMARY ====================
describe('📋 Failure Scenarios Summary', () => {
    it('List all scenarios that would fail CI/CD', () => {
        const failureScenarios = {
            'Lint Failures': [
                'Unused variables',
                'Inconsistent spacing',
                'Missing semicolons',
                'Mixed quote styles'
            ],
            'Unit Test Failures': [
                'Empty validation not working',
                'Wrong return types',
                'Wrong status codes',
                'Missing error handling'
            ],
            'Integration Failures': [
                'Missing response fields',
                'Request timeouts',
                'Incorrect error format',
                'Database connection errors'
            ],
            'Frontend Failures': [
                'Unclosed HTML tags',
                'CSS syntax errors',
                'JavaScript syntax errors',
                'Missing file references'
            ],
            'Dependency Failures': [
                'Version incompatibilities',
                'Missing dependencies',
                'Node version too old'
            ],
            'Security Failures': [
                'Hardcoded credentials',
                'SQL injection',
                'XSS vulnerabilities'
            ],
            'Coverage Failures': [
                'Coverage below threshold',
                'Untested files'
            ]
        };

        console.log('\n🚨 Failure Scenarios by Type:\n');
        Object.entries(failureScenarios).forEach(([category, scenarios]) => {
            console.log(`${category}:`);
            scenarios.forEach(scenario => {
                console.log(`  ❌ ${scenario}`);
            });
            console.log();
        });

        expect(Object.keys(failureScenarios).length).toBe(7);
    });
});
