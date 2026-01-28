// src/data/level2_debug.js

export const DEBUG_LEVELS = [
    {
        id: 1,
        title: "The Infinite Loop",
        description: "This Python function is supposed to sum numbers from 0 to n, but it runs forever. Find the bug and fix the logic so it returns the correct sum.",
        language: "python",
        initialCode: `def calculate_sum(n):
    total = 0
    i = 0
    while i <= n:
        total += i
        # ERROR: Something is missing here!
    return total`,
        solutionCode: "i += 1 (Increment inside loop)", // Shown in Master Control

        // Driver reads input, calls function, prints output
        driverCode: `
import sys
try:
    input_val = sys.stdin.read().strip()
    if not input_val: exit()
    n = int(input_val)
    print(calculate_sum(n))
except Exception as e:
    print(e)
    `,
        testCases: [
            { type: "base", input: "5", expected: "15" },
            { type: "base", input: "10", expected: "55" },
            { type: "hidden", input: "0", expected: "0" },
            { type: "hidden", input: "100", expected: "5050" }
        ]
    },
    {
        id: 2,
        title: "Broken Array Filter",
        description: "This JavaScript function should return only positive numbers. Currently it includes 0 and crashes on some inputs. Fix the loop logic.",
        language: "javascript",
        initialCode: `function filterPositives(arr) {
    let result = [];
    // ERROR: Check the loop condition carefully
    for (let i = 0; i <= arr.length; i++) { 
        if (arr[i] > 0) {
            result.push(arr[i]);
        }
    }
    return result;
}`,
        solutionCode: "i < arr.length (Fix off-by-one error)",

        driverCode: `
const fs = require('fs');
const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
try {
    console.log(JSON.stringify(filterPositives(input)));
} catch(e) {
    console.error(e.message);
}
    `,
        testCases: [
            { type: "base", input: "[-1, 0, 1, 2]", expected: "[1,2]" },
            { type: "base", input: "[5, 10, -5]", expected: "[5,10]" },
            { type: "hidden", input: "[]", expected: "[]" },
            { type: "hidden", input: "[-1, -2]", expected: "[]" }
        ]
    },
    {
        id: 3,
        title: "String Reversal Crash",
        description: "Fix this C++ function to correctly reverse a string in-place. The current logic produces garbage characters.",
        language: "cpp",
        initialCode: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

string reverseString(string s) {
    int n = s.length();
    // ERROR: Loop goes too far!
    for (int i = 0; i < n; i++) { 
        swap(s[i], s[n - 1 - i]);
    }
    return s;
}`,
        solutionCode: "i < n / 2 (Loop only half the string)",

        driverCode: `
int main() {
    string input;
    if (cin >> input) {
        cout << reverseString(input);
    }
    return 0;
}`,
        testCases: [
            { type: "base", input: "hello", expected: "olleh" },
            { type: "base", input: "code", expected: "edoc" },
            { type: "hidden", input: "a", expected: "a" },
            { type: "hidden", input: "racecar", expected: "racecar" }
        ]
    }
];