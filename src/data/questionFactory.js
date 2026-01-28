// src/data/questionFactory.js

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const vars = {
    arr: ["nums", "data", "list", "values", "nodes"],
    idx: ["i", "j", "ptr", "curr", "k"],
    val: ["val", "x", "n", "num", "count"],
    target: ["target", "key", "goal"],
    str: ["s", "word", "text"],
};

const TEMPLATES = {
    sum_array: {
        title: "Array Summation",
        desc: "Calculate the sum of all elements.",
        testCases: [
            { input: "1 2 3", expected: "6" },
            { input: "-1 1", expected: "0" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.arr}):\n    total = 0\n    # Bug: range(len - 1) misses last element\n    for i in range(len(${v.arr}) - 1):\n        total += ${v.arr}[i]\n    return total`,
                fullSolution: `def solve(${v.arr}):\n    total = 0\n    # Fixed\n    for i in range(len(${v.arr})):\n        total += ${v.arr}[i]\n    return total`,
                solution: `range(len(${v.arr}))`,
                driver: `import sys; print(solve([int(x) for x in sys.stdin.read().split() if x]))`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.arr}) {\n    let total = 0;\n    // Bug: <= causes IndexOutOfBounds/NaN\n    for(let i=0; i<=${v.arr}.length; i++) total += ${v.arr}[i];\n    return total;\n}`,
                fullSolution: `function solve(${v.arr}) {\n    let total = 0;\n    // Fixed\n    for(let i=0; i<${v.arr}.length; i++) total += ${v.arr}[i];\n    return total;\n}`,
                solution: `i < ${v.arr}.length`,
                driver: `const fs=require('fs'); console.log(solve(fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number)));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    int t=0;\n    // Bug: Start at 1 misses first element\n    for(int i=1; i<${v.arr}.size(); i++) t+=${v.arr}[i];\n    return t;\n}};`,
                fullSolution: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    int t=0;\n    // Fixed\n    for(int i=0; i<${v.arr}.size(); i++) t+=${v.arr}[i];\n    return t;\n}};`,
                driver: `#include <iostream>\n#include <vector>\nusing namespace std;\n// Insert User Code Class Here\nint main(){vector<int> v; int i; while(cin>>i)v.push_back(i); cout<<Solution().solve(v); return 0;}`,
            }),
            java: (v) => ({
                initial: `class Solution { public int solve(int[] ${v.arr}) {\n    int t=0;\n    // Bug: <= causes Exception\n    for(int i=0; i<=${v.arr}.length; i++) t+=${v.arr}[i];\n    return t;\n}}`,
                fullSolution: `class Solution { public int solve(int[] ${v.arr}) {\n    int t=0;\n    // Fixed\n    for(int i=0; i<${v.arr}.length; i++) t+=${v.arr}[i];\n    return t;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); ArrayList<Integer> l=new ArrayList<>(); while(s.hasNextInt())l.add(s.nextInt()); System.out.println(new Solution().solve(l.stream().mapToInt(i->i).toArray())); } // Insert User Code Here\n}`,
            }),
        },
    },
    recursion_fib: {
        title: "Recursive Fibonacci",
        desc: "Calculate the Nth Fibonacci number recursively. 0->0, 1->1, 2->1, 3->2...",
        testCases: [
            { input: "5", expected: "5" },
            { input: "6", expected: "8" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(n):\n    # Bug: Missing base case for n < 2\n    if n == 0: return 0\n    return solve(n-1) + solve(n-2)`,
                fullSolution: `def solve(n):\n    # Fixed\n    if n <= 1: return n\n    return solve(n-1) + solve(n-2)`,
                solution: `if n <= 1: return n`,
                driver: `import sys; print(solve(int(sys.stdin.read())))`,
            }),
            javascript: (v) => ({
                initial: `function solve(n) {\n    // Bug: Missing base case causing StackOverflow\n    if (n === 0) return 0;\n    return solve(n-1) + solve(n-2);\n}`,
                fullSolution: `function solve(n) {\n    // Fixed\n    if (n <= 1) return n;\n    return solve(n-1) + solve(n-2);\n}`,
                solution: `if (n <= 1) return n;`,
                driver: `const fs=require('fs'); console.log(solve(Number(fs.readFileSync(0,'utf-8'))));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: int solve(int n) {\n    // Bug: Missing base case\n    if(n==0) return 0;\n    return solve(n-1) + solve(n-2);\n}};`,
                fullSolution: `class Solution { public: int solve(int n) {\n    // Fixed\n    if(n<=1) return n;\n    return solve(n-1) + solve(n-2);\n}};`,
                driver: `#include <iostream>\nusing namespace std;\n// Insert User Code Class Here\nint main(){int n; cin>>n; cout<<Solution().solve(n);}`,
            }),
            java: (v) => ({
                initial: `class Solution { public int solve(int n) {\n    // Bug: Missing base case\n    if(n==0) return 0;\n    return solve(n-1) + solve(n-2);\n}}`,
                fullSolution: `class Solution { public int solve(int n) {\n    // Fixed\n    if(n<=1) return n;\n    return solve(n-1) + solve(n-2);\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); System.out.println(new Solution().solve(s.nextInt())); } // Insert User Code Here\n}`,
            }),
        },
    },
    linked_list_rev: {
        title: "Reverse Linked List",
        desc: "Reverse a singly linked list. Return the new head.",
        testCases: [
            { input: "1 2 3", expected: "3 2 1" },
            { input: "5", expected: "5" },
        ],
        langs: {
            python: (v) => ({
                initial: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head):\n    prev = None\n    curr = head\n    while curr:\n        # Bug: Overwriting curr.next before saving it loses the list!\n        curr.next = prev\n        prev = curr\n        curr = curr.next\n    return prev`,
                fullSolution: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev`,
                solution: `temp = curr.next; curr.next = prev; ... curr = temp`,
                driver: `import sys\ndef to_list(head):\n    res = []\n    while head: res.append(str(head.val)); head = head.next\n    return " ".join(res)\ninputs = sys.stdin.read().split()\nif not inputs: exit()\nhead = ListNode(int(inputs[0]))\ncurr = head\nfor x in inputs[1:]: curr.next = ListNode(int(x)); curr = curr.next\nprint(to_list(solve(head)))`,
            }),
            javascript: (v) => ({
                initial: `class ListNode {\n    constructor(val=0, next=null) {\n        this.val = val; this.next = next;\n    }\n}\n\nfunction solve(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        // Bug: Connection lost\n        curr.next = prev;\n        prev = curr;\n        curr = curr.next;\n    }\n    return prev;\n}`,
                fullSolution: `class ListNode {\n    constructor(val=0, next=null) {\n        this.val = val; this.next = next;\n    }\n}\n\nfunction solve(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
                solution: `let temp = curr.next;`,
                driver: `const fs = require('fs'); const nums = fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number); if(nums.length === 0) return; let head = new ListNode(nums[0]); let curr = head; for(let i=1; i<nums.length; i++) { curr.next = new ListNode(nums[i]); curr = curr.next; } let res = []; let resHead = solve(head); while(resHead) { res.push(resHead.val); resHead = resHead.next; } console.log(res.join(" "));`,
            }),
            cpp: (v) => ({
                initial: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution { public: ListNode* solve(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while(curr) {\n        // Bug: Lost next pointer\n        curr->next = prev;\n        prev = curr;\n        curr = curr->next;\n    }\n    return prev;\n}};`,
                fullSolution: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution { public: ListNode* solve(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while(curr) {\n        ListNode* nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}};`,
                driver: `#include <iostream>\n#include <vector>\nusing namespace std;\n// Insert User Code Class Here\nint main() { int val; vector<int> nums; while(cin >> val) nums.push_back(val); if(nums.empty()) return 0; ListNode* head = new ListNode(nums[0]); ListNode* curr = head; for(size_t i=1; i<nums.size(); i++) { curr->next = new ListNode(nums[i]); curr = curr->next; } ListNode* res = Solution().solve(head); while(res) { cout << res->val << (res->next ? " " : ""); res = res->next; } return 0; }`,
            }),
            java: (v) => ({
                initial: `class ListNode {\n    int val; ListNode next; \n    ListNode(int x) { val = x; }\n}\n\nclass Solution {\n    public ListNode solve(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while(curr != null) {\n            // Bug: Lost connection\n            curr.next = prev;\n            prev = curr;\n            curr = curr.next;\n        }\n        return prev;\n    }\n}`,
                fullSolution: `class ListNode {\n    int val; ListNode next; \n    ListNode(int x) { val = x; }\n}\n\nclass Solution {\n    public ListNode solve(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while(curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s = new Scanner(System.in); if(!s.hasNextInt()) return; ListNode head = new ListNode(s.nextInt()); ListNode curr = head; while(s.hasNextInt()) { curr.next = new ListNode(s.nextInt()); curr = curr.next; } ListNode res = new Solution().solve(head); while(res != null) { System.out.print(res.val + (res.next != null ? " " : "")); res = res.next; } } // Insert User Code Here\n}`,
            }),
        },
    },
    find_max: {
        title: "Find Maximum",
        desc: "Find the largest number in an array. Arrays may contain negative numbers.",
        testCases: [
            { input: "1 5 3", expected: "5" },
            { input: "-10 -2 -5", expected: "-2" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.arr}):\n    # Bug: Init to 0 fails for all-negative arrays\n    max_val = 0\n    for ${v.val} in ${v.arr}:\n        if ${v.val} > max_val:\n            max_val = ${v.val}\n    return max_val`,
                fullSolution: `def solve(${v.arr}):\n    # Fixed\n    max_val = float('-inf')\n    for ${v.val} in ${v.arr}:\n        if ${v.val} > max_val:\n            max_val = ${v.val}\n    return max_val`,
                solution: `max_val = float('-inf')`,
                driver: `import sys; nums = [int(x) for x in sys.stdin.read().split() if x]; print(solve(nums) if nums else 0)`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.arr}) {\n    // Bug: 0 initialization fails for negatives\n    let max = 0;\n    for(let ${v.val} of ${v.arr}) {\n        if(${v.val} > max) max = ${v.val};\n    }\n    return max;\n}`,
                fullSolution: `function solve(${v.arr}) {\n    // Fixed\n    let max = -Infinity;\n    for(let ${v.val} of ${v.arr}) {\n        if(${v.val} > max) max = ${v.val};\n    }\n    return max;\n}`,
                solution: `let max = -Infinity;`,
                driver: `const fs=require('fs'); const nums=fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number); console.log(nums.length?solve(nums):0);`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    // Bug: 0 initialization\n    int m = 0;\n    for(int ${v.val} : ${v.arr}) {\n        if(${v.val} > m) m = ${v.val};\n    }\n    return m;\n}};`,
                fullSolution: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    // Fixed\n    if(${v.arr}.empty()) return 0;\n    int m = ${v.arr}[0];\n    for(int ${v.val} : ${v.arr}) {\n        if(${v.val} > m) m = ${v.val};\n    }\n    return m;\n}};`,
                driver: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n// Insert User Code Class Here\nint main(){vector<int> v; int i; while(cin>>i)v.push_back(i); if(v.empty())return 0; cout<<Solution().solve(v); return 0;}`,
            }),
            java: (v) => ({
                initial: `class Solution { public int solve(int[] ${v.arr}) {\n    // Bug: 0 initialization\n    int m = 0;\n    for(int ${v.val} : ${v.arr}) {\n        if(${v.val} > m) m = ${v.val};\n    }\n    return m;\n}}`,
                fullSolution: `class Solution { public int solve(int[] ${v.arr}) {\n    // Fixed\n    if(${v.arr}.length == 0) return 0;\n    int m = ${v.arr}[0];\n    for(int ${v.val} : ${v.arr}) {\n        if(${v.val} > m) m = ${v.val};\n    }\n    return m;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); ArrayList<Integer> l=new ArrayList<>(); while(s.hasNextInt())l.add(s.nextInt()); if(l.size()==0)return; System.out.println(new Solution().solve(l.stream().mapToInt(i->i).toArray())); } // Insert User Code Here\n}`,
            }),
        },
    },
    is_palindrome: {
        title: "Check Palindrome",
        desc: "Return true if the string is a palindrome, false otherwise.",
        testCases: [
            { input: "racecar", expected: "true" },
            { input: "hello", expected: "false" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.str}):\n    # Bug: Logic compares wrong indices or range\n    for ${v.idx} in range(len(${v.str}) // 2):\n        if ${v.str}[${v.idx}] != ${v.str}[len(${v.str}) - ${v.idx}]:\n            return False\n    return True`,
                fullSolution: `def solve(${v.str}):\n    # Fixed\n    for ${v.idx} in range(len(${v.str}) // 2):\n        if ${v.str}[${v.idx}] != ${v.str}[len(${v.str}) - 1 - ${v.idx}]:\n            return False\n    return True`,
                solution: `len(${v.str}) - 1 - ${v.idx}`,
                driver: `import sys; print(str(solve(sys.stdin.read().strip())).lower())`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.str}) {\n    // Bug: Off-by-one in comparison index\n    for(let ${v.idx}=0; ${v.idx}<${v.str}.length/2; ${v.idx}++) {\n        if(${v.str}[${v.idx}] !== ${v.str}[${v.str}.length - ${v.idx}]) return false;\n    }\n    return true;\n}`,
                fullSolution: `function solve(${v.str}) {\n    // Fixed\n    for(let ${v.idx}=0; ${v.idx}<${v.str}.length/2; ${v.idx}++) {\n        if(${v.str}[${v.idx}] !== ${v.str}[${v.str}.length - 1 - ${v.idx}]) return false;\n    }\n    return true;\n}`,
                solution: `${v.str}.length - 1 - ${v.idx}`,
                driver: `const fs=require('fs'); console.log(solve(fs.readFileSync(0,'utf-8').trim()));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: bool solve(string ${v.str}) {\n    int n = ${v.str}.length();\n    // Bug: Wrong index calculation\n    for(int ${v.idx}=0; ${v.idx}<n/2; ${v.idx}++) {\n        if(${v.str}[${v.idx}] != ${v.str}[n - ${v.idx}]) return false;\n    }\n    return true;\n}};`,
                fullSolution: `class Solution { public: bool solve(string ${v.str}) {\n    int n = ${v.str}.length();\n    // Fixed\n    for(int ${v.idx}=0; ${v.idx}<n/2; ${v.idx}++) {\n        if(${v.str}[${v.idx}] != ${v.str}[n - 1 - ${v.idx}]) return false;\n    }\n    return true;\n}};`,
                driver: `#include <iostream>\n#include <string>\nusing namespace std;\n// Insert User Code Class Here\nint main(){string s; cin>>s; cout<<(Solution().solve(s)?"true":"false");}`,
            }),
            java: (v) => ({
                initial: `class Solution { public boolean solve(String ${v.str}) {\n    int n = ${v.str}.length();\n    // Bug: Wrong index logic causing OOB or logic error\n    for(int ${v.idx}=0; ${v.idx}<n/2; ${v.idx}++) {\n        if(${v.str}.charAt(${v.idx}) != ${v.str}.charAt(n - ${v.idx})) return false;\n    }\n    return true;\n}}`,
                fullSolution: `class Solution { public boolean solve(String ${v.str}) {\n    int n = ${v.str}.length();\n    // Fixed\n    for(int ${v.idx}=0; ${v.idx}<n/2; ${v.idx}++) {\n        if(${v.str}.charAt(${v.idx}) != ${v.str}.charAt(n - 1 - ${v.idx})) return false;\n    }\n    return true;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); if(s.hasNext()) System.out.println(new Solution().solve(s.next())); } // Insert User Code Here\n}`,
            }),
        },
    },
    count_evens: {
        title: "Count Evens",
        desc: "Count the number of even integers in the list.",
        testCases: [
            { input: "1 2 3 4", expected: "2" },
            { input: "1 3 5", expected: "0" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.arr}):\n    ${v.val} = 0\n    for x in ${v.arr}:\n        # Bug: % 2 == 1 checks for ODD, not EVEN\n        if x % 2 == 1:\n            ${v.val} += 1\n    return ${v.val}`,
                fullSolution: `def solve(${v.arr}):\n    ${v.val} = 0\n    for x in ${v.arr}:\n        # Fixed\n        if x % 2 == 0:\n            ${v.val} += 1\n    return ${v.val}`,
                solution: `x % 2 == 0`,
                driver: `import sys; print(solve([int(x) for x in sys.stdin.read().split() if x]))`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.arr}) {\n    let count = 0;\n    for(let x of ${v.arr}) {\n        // Bug: Checks for odd numbers\n        if(x % 2 === 1) count++;\n    }\n    return count;\n}`,
                fullSolution: `function solve(${v.arr}) {\n    let count = 0;\n    for(let x of ${v.arr}) {\n        // Fixed\n        if(x % 2 === 0) count++;\n    }\n    return count;\n}`,
                solution: `x % 2 === 0`,
                driver: `const fs=require('fs'); console.log(solve(fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number)));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    int c = 0;\n    for(int x : ${v.arr}) {\n        // Bug: Checks for odd\n        if(x % 2 == 1) c++;\n    }\n    return c;\n}};`,
                fullSolution: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    int c = 0;\n    for(int x : ${v.arr}) {\n        // Fixed\n        if(x % 2 == 0) c++;\n    }\n    return c;\n}};`,
                driver: `#include <iostream>\n#include <vector>\nusing namespace std;\n// Insert User Code Class Here\nint main(){vector<int> v; int i; while(cin>>i)v.push_back(i); cout<<Solution().solve(v); return 0;}`,
            }),
            java: (v) => ({
                initial: `class Solution { public int solve(int[] ${v.arr}) {\n    int c = 0;\n    for(int x : ${v.arr}) {\n        // Bug: Checks for odd\n        if(x % 2 == 1) c++;\n    }\n    return c;\n}}`,
                fullSolution: `class Solution { public int solve(int[] ${v.arr}) {\n    int c = 0;\n    for(int x : ${v.arr}) {\n        // Fixed\n        if(x % 2 == 0) c++;\n    }\n    return c;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); ArrayList<Integer> l=new ArrayList<>(); while(s.hasNextInt())l.add(s.nextInt()); System.out.println(new Solution().solve(l.stream().mapToInt(i->i).toArray())); } // Insert User Code Here\n}`,
            }),
        },
    },
    factorial_calc: {
        title: "Factorial",
        desc: "Calculate N!. Return 1 for N=0. Assume N >= 0.",
        testCases: [
            { input: "5", expected: "120" },
            { input: "0", expected: "1" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(n):\n    res = 1\n    # Bug: Range is exclusive, so it stops before n\n    for ${v.idx} in range(1, n):\n        res *= ${v.idx}\n    return res`,
                fullSolution: `def solve(n):\n    res = 1\n    # Fixed\n    for ${v.idx} in range(1, n + 1):\n        res *= ${v.idx}\n    return res`,
                solution: `range(1, n + 1)`,
                driver: `import sys; print(solve(int(sys.stdin.read())))`,
            }),
            javascript: (v) => ({
                initial: `function solve(n) {\n    let res = 1;\n    // Bug: < n misses the last number\n    for(let ${v.idx}=1; ${v.idx} < n; ${v.idx}++) {\n        res *= ${v.idx};\n    }\n    return res;\n}`,
                fullSolution: `function solve(n) {\n    let res = 1;\n    // Fixed\n    for(let ${v.idx}=1; ${v.idx} <= n; ${v.idx}++) {\n        res *= ${v.idx};\n    }\n    return res;\n}`,
                solution: `${v.idx} <= n`,
                driver: `const fs=require('fs'); console.log(solve(Number(fs.readFileSync(0,'utf-8'))));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: long long solve(int n) {\n    long long res = 1;\n    // Bug: < n misses the last number\n    for(int ${v.idx}=1; ${v.idx} < n; ${v.idx}++) {\n        res *= ${v.idx};\n    }\n    return res;\n}};`,
                fullSolution: `class Solution { public: long long solve(int n) {\n    long long res = 1;\n    // Fixed\n    for(int ${v.idx}=1; ${v.idx} <= n; ${v.idx}++) {\n        res *= ${v.idx};\n    }\n    return res;\n}};`,
                driver: `#include <iostream>\nusing namespace std;\n// Insert User Code Class Here\nint main(){int n; cin>>n; cout<<Solution().solve(n);}`,
            }),
            java: (v) => ({
                initial: `class Solution { public long solve(int n) {\n    long res = 1;\n    // Bug: < n misses the last number\n    for(int ${v.idx}=1; ${v.idx} < n; ${v.idx}++) {\n        res *= ${v.idx};\n    }\n    return res;\n}}`,
                fullSolution: `class Solution { public long solve(int n) {\n    long res = 1;\n    // Fixed\n    for(int ${v.idx}=1; ${v.idx} <= n; ${v.idx}++) {\n        res *= ${v.idx};\n    }\n    return res;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); System.out.println(new Solution().solve(s.nextInt())); } // Insert User Code Here\n}`,
            }),
        },
    },
    linked_list_middle: {
        title: "Middle of Linked List",
        desc: "Find the middle node of a linked list. If there are two middle nodes, return the second one.",
        testCases: [
            { input: "1 2 3 4 5", expected: "3" },
            { input: "1 2 3 4 5 6", expected: "4" },
        ],
        langs: {
            python: (v) => ({
                initial: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head):\n    slow = head\n    fast = head\n    # Bug: Logic error crashes if list length is even (fast becomes None)\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
                fullSolution: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head):\n    slow = head\n    fast = head\n    # Fixed\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
                solution: `while fast and fast.next:`,
                driver: `import sys\nclass ListNode: def __init__(s,v=0,n=None): s.val=v; s.next=n\ndef to_list(head): res=[]; cur=head\n while cur: res.append(str(cur.val)); cur=cur.next\n return " ".join(res)\nnums=[int(x) for x in sys.stdin.read().split()]\nif not nums: exit()\nh=ListNode(nums[0]); c=h\nfor x in nums[1:]: c.next=ListNode(x); c=c.next\nres=solve(h)\nprint(res.val if res else "")`,
            }),
            javascript: (v) => ({
                initial: `class ListNode { constructor(val=0, next=null) { this.val=val; this.next=next; } }\n\nfunction solve(head) {\n    let slow = head;\n    let fast = head;\n    // Bug: 'fast.next' check missing, throws error on even lengths when fast becomes null\n    while (fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}`,
                fullSolution: `class ListNode { constructor(val=0, next=null) { this.val=val; this.next=next; } }\n\nfunction solve(head) {\n    let slow = head;\n    let fast = head;\n    // Fixed\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}`,
                solution: `while (fast && fast.next)`,
                driver: `const fs=require('fs');const n=fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number);if(!n.length)return;let h=new ListNode(n[0]),c=h;for(let i=1;i<n.length;i++){c.next=new ListNode(n[i]);c=c.next;}let r=solve(h);console.log(r?r.val:'');`,
            }),
            cpp: (v) => ({
                initial: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(NULL) {} };\nclass Solution { public: ListNode* solve(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    // Bug: Missing check for fast itself causes SegFault\n    while(fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}};`,
                fullSolution: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(NULL) {} };\nclass Solution { public: ListNode* solve(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    // Fixed\n    while(fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}};`,
                driver: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main(){int x;vector<int>n;while(cin>>x)n.push_back(x);if(n.empty())return 0;ListNode* h=new ListNode(n[0]);ListNode* c=h;for(size_t i=1;i<n.size();i++){c->next=new ListNode(n[i]);c=c->next;}cout<<(Solution().solve(h)->val);}`,
            }),
            java: (v) => ({
                initial: `class ListNode { int val; ListNode next; ListNode(int x){val=x;} }\nclass Solution { public ListNode solve(ListNode head) {\n    ListNode slow = head;\n    ListNode fast = head;\n    // Bug: Missing null check for 'fast' causes NullPointerException\n    while(fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}}`,
                fullSolution: `class ListNode { int val; ListNode next; ListNode(int x){val=x;} }\nclass Solution { public ListNode solve(ListNode head) {\n    ListNode slow = head;\n    ListNode fast = head;\n    // Fixed\n    while(fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}}`,
                driver: `import java.util.*;public class Main{public static void main(String[] a){Scanner s=new Scanner(System.in);if(!s.hasNext())return;ListNode h=new ListNode(s.nextInt());ListNode c=h;while(s.hasNext()){c.next=new ListNode(s.nextInt());c=c.next;}ListNode r=new Solution().solve(h);System.out.println(r==null?"":r.val);}}`,
            }),
        },
    },
    linked_list_delete: {
        title: "Delete Value from List",
        desc: "Delete the *first* occurrence of a specific value from the linked list. The target value is the last number in the input.",
        testCases: [
            { input: "1 2 6 3 4 6", expected: "1 2 3 4" },
            { input: "7 7 7 2 7", expected: "7 7 2" },
        ],
        langs: {
            python: (v) => ({
                initial: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head, val):\n    # Bug: Fails to handle case where head itself needs to be removed\n    curr = head\n    while curr.next:\n        if curr.next.val == val:\n            curr.next = curr.next.next\n            return head\n        curr = curr.next\n    return head`,
                fullSolution: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head, val):\n    # Fixed\n    if head.val == val: return head.next\n    curr = head\n    while curr.next:\n        if curr.next.val == val:\n            curr.next = curr.next.next\n            return head\n        curr = curr.next\n    return head`,
                solution: `if head.val == val: return head.next`,
                driver: `import sys\nclass ListNode: def __init__(s,v=0,n=None): s.val=v; s.next=n\ndef to_list(head): res=[]; cur=head\n while cur: res.append(str(cur.val)); cur=cur.next\n return " ".join(res)\nnums=[int(x) for x in sys.stdin.read().split()]\nif len(nums)<2: exit()\ntarget=nums.pop()\nh=ListNode(nums[0]); c=h\nfor x in nums[1:]: c.next=ListNode(x); c=c.next\nprint(to_list(solve(h, target)))`,
            }),
            javascript: (v) => ({
                initial: `class ListNode { constructor(val=0, next=null) { this.val=val; this.next=next; } }\n\nfunction solve(head, val) {\n    // Bug: Missing head check\n    let curr = head;\n    while(curr.next) {\n        if(curr.next.val === val) {\n            curr.next = curr.next.next;\n            return head;\n        }\n        curr = curr.next;\n    }\n    return head;\n}`,
                fullSolution: `class ListNode { constructor(val=0, next=null) { this.val=val; this.next=next; } }\n\nfunction solve(head, val) {\n    // Fixed\n    if(head.val === val) return head.next;\n    let curr = head;\n    while(curr.next) {\n        if(curr.next.val === val) {\n            curr.next = curr.next.next;\n            return head;\n        }\n        curr = curr.next;\n    }\n    return head;\n}`,
                solution: `if(head.val === val) return head.next;`,
                driver: `const fs=require('fs');const n=fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number);if(n.length<2)return;let t=n.pop();let h=new ListNode(n[0]),c=h;for(let i=1;i<n.length;i++){c.next=new ListNode(n[i]);c=c.next;}let r=solve(h,t);let a=[];while(r){a.push(r.val);r=r.next;}console.log(a.join(' '));`,
            }),
            cpp: (v) => ({
                initial: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(NULL) {} };\nclass Solution { public: ListNode* solve(ListNode* head, int val) {\n    // Bug: Missing head removal logic\n    ListNode* curr = head;\n    while(curr->next) {\n        if(curr->next->val == val) {\n            curr->next = curr->next->next;\n            return head;\n        }\n        curr = curr->next;\n    }\n    return head;\n}};`,
                fullSolution: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(NULL) {} };\nclass Solution { public: ListNode* solve(ListNode* head, int val) {\n    // Fixed\n    if(head->val == val) return head->next;\n    ListNode* curr = head;\n    while(curr->next) {\n        if(curr->next->val == val) {\n            curr->next = curr->next->next;\n            return head;\n        }\n        curr = curr->next;\n    }\n    return head;\n}};`,
                driver: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main(){int x;vector<int>n;while(cin>>x)n.push_back(x);if(n.size()<2)return 0;int t=n.back();n.pop_back();ListNode* h=new ListNode(n[0]);ListNode* c=h;for(size_t i=1;i<n.size();i++){c->next=new ListNode(n[i]);c=c->next;}ListNode* r=Solution().solve(h,t);while(r){cout<<r->val<<(r->next?" ":"");r=r->next;}}`,
            }),
            java: (v) => ({
                initial: `class ListNode { int val; ListNode next; ListNode(int x){val=x;} }\nclass Solution { public ListNode solve(ListNode head, int val) {\n    // Bug: Missing head removal logic\n    ListNode curr = head;\n    while(curr.next != null) {\n        if(curr.next.val == val) {\n            curr.next = curr.next.next;\n            return head;\n        }\n        curr = curr.next;\n    }\n    return head;\n}}`,
                fullSolution: `class ListNode { int val; ListNode next; ListNode(int x){val=x;} }\nclass Solution { public ListNode solve(ListNode head, int val) {\n    // Fixed\n    if(head.val == val) return head.next;\n    ListNode curr = head;\n    while(curr.next != null) {\n        if(curr.next.val == val) {\n            curr.next = curr.next.next;\n            return head;\n        }\n        curr = curr.next;\n    }\n    return head;\n}}`,
                driver: `import java.util.*;public class Main{public static void main(String[] a){Scanner s=new Scanner(System.in);ArrayList<Integer> l=new ArrayList<>();while(s.hasNextInt())l.add(s.nextInt());if(l.size()<2)return;int t=l.remove(l.size()-1);ListNode h=new ListNode(l.get(0));ListNode c=h;for(int i=1;i<l.size();i++){c.next=new ListNode(l.get(i));c=c.next;}ListNode r=new Solution().solve(h,t);while(r!=null){System.out.print(r.val+(r.next!=null?" ":""));r=r.next;}}`,
            }),
        },
    },
    string_vowel_count: {
        title: "Count Vowels",
        desc: "Count the number of vowels (a, e, i, o, u) in the string. Input is a single word.",
        testCases: [
            { input: "Hello", expected: "2" },
            { input: "Rhythm", expected: "0" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.str}):\n    count = 0\n    vowels = "aeiou"\n    for char in ${v.str}:\n        # Bug: Fails to count uppercase vowels\n        if char in vowels:\n            count += 1\n    return count`,
                fullSolution: `def solve(${v.str}):\n    count = 0\n    vowels = "aeiou"\n    for char in ${v.str}:\n        # Fixed\n        if char.lower() in vowels:\n            count += 1\n    return count`,
                solution: `if char.lower() in vowels:`,
                driver: `import sys; print(solve(sys.stdin.read().strip()))`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.str}) {\n    let count = 0;\n    const vowels = "aeiou";\n    for(let char of ${v.str}) {\n        // Bug: Case sensitivity\n        if(vowels.includes(char)) count++;\n    }\n    return count;\n}`,
                fullSolution: `function solve(${v.str}) {\n    let count = 0;\n    const vowels = "aeiou";\n    for(let char of ${v.str}) {\n        // Fixed\n        if(vowels.includes(char.toLowerCase())) count++;\n    }\n    return count;\n}`,
                solution: `vowels.includes(char.toLowerCase())`,
                driver: `const fs=require('fs'); console.log(solve(fs.readFileSync(0,'utf-8').trim()));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: int solve(string ${v.str}) {\n    int c = 0;\n    string v = "aeiou";\n    for(char ch : ${v.str}) {\n        // Bug: Case sensitivity\n        if(v.find(ch) != string::npos) c++;\n    }\n    return c;\n}};`,
                fullSolution: `class Solution { public: int solve(string ${v.str}) {\n    int c = 0;\n    string v = "aeiou";\n    for(char ch : ${v.str}) {\n        // Fixed\n        if(v.find(tolower(ch)) != string::npos) c++;\n    }\n    return c;\n}};`,
                driver: `#include <iostream>\n#include <string>\nusing namespace std;\nint main(){string s; cin>>s; cout<<Solution().solve(s);}`,
            }),
            java: (v) => ({
                initial: `class Solution { public int solve(String ${v.str}) {\n    int c = 0;\n    String v = "aeiou";\n    for(char ch : ${v.str}.toCharArray()) {\n        // Bug: Case sensitivity\n        if(v.indexOf(ch) != -1) c++;\n    }\n    return c;\n}}`,
                fullSolution: `class Solution { public int solve(String ${v.str}) {\n    int c = 0;\n    String v = "aeiou";\n    for(char ch : ${v.str}.toCharArray()) {\n        // Fixed\n        if(v.indexOf(Character.toLowerCase(ch)) != -1) c++;\n    }\n    return c;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); if(s.hasNext()) System.out.println(new Solution().solve(s.next())); }}`
            }),
        },
    },
    string_remove_char: {
        title: "Remove Character",
        desc: "Remove all occurrences of 'x' from the string.",
        testCases: [
            { input: "xerox", expected: "ero" },
            { input: "taxi", expected: "tai" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.str}):\n    res = ""\n    for ch in ${v.str}:\n        # Bug: Logic adds 'x' instead of skipping it\n        if ch == 'x':\n            res += ch\n    return res`,
                fullSolution: `def solve(${v.str}):\n    res = ""\n    for ch in ${v.str}:\n        # Fixed\n        if ch != 'x':\n            res += ch\n    return res`,
                solution: `if ch != 'x': res += ch`,
                driver: `import sys; print(solve(sys.stdin.read().strip()))`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.str}) {\n    let res = "";\n    for(let ch of ${v.str}) {\n        // Bug: Adds only 'x' instead of removing it\n        if(ch === 'x') res += ch;\n    }\n    return res;\n}`,
                fullSolution: `function solve(${v.str}) {\n    let res = "";\n    for(let ch of ${v.str}) {\n        // Fixed\n        if(ch !== 'x') res += ch;\n    }\n    return res;\n}`,
                solution: `if(ch !== 'x')`,
                driver: `const fs=require('fs'); console.log(solve(fs.readFileSync(0,'utf-8').trim()));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: string solve(string ${v.str}) {\n    string res = "";\n    for(char ch : ${v.str}) {\n        // Bug: Adds only 'x'\n        if(ch == 'x') res += ch;\n    }\n    return res;\n}};`,
                fullSolution: `class Solution { public: string solve(string ${v.str}) {\n    string res = "";\n    for(char ch : ${v.str}) {\n        // Fixed\n        if(ch != 'x') res += ch;\n    }\n    return res;\n}};`,
                driver: `#include <iostream>\n#include <string>\nusing namespace std;\nint main(){string s; cin>>s; cout<<Solution().solve(s);}`,
            }),
            java: (v) => ({
                initial: `class Solution { public String solve(String ${v.str}) {\n    StringBuilder res = new StringBuilder();\n    for(char ch : ${v.str}.toCharArray()) {\n        // Bug: Adds only 'x'\n        if(ch == 'x') res.append(ch);\n    }\n    return res.toString();\n}}`,
                fullSolution: `class Solution { public String solve(String ${v.str}) {\n    StringBuilder res = new StringBuilder();\n    for(char ch : ${v.str}.toCharArray()) {\n        // Fixed\n        if(ch != 'x') res.append(ch);\n    }\n    return res.toString();\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); if(s.hasNext()) System.out.println(new Solution().solve(s.next())); }}`,
            }),
        },
    },
    string_repeat: {
        title: "Repeat String",
        desc: "Create a string that repeats the input N times. Input is string then N.",
        testCases: [
            { input: "Hi 3", expected: "HiHiHi" },
            { input: "Go 1", expected: "Go" },
        ],
        langs: {
            python: (v) => ({
                initial: `def solve(${v.str}, n):\n    res = ""\n    # Bug: Off-by-one error in loop range\n    for i in range(n - 1):\n        res += ${v.str}\n    return res`,
                fullSolution: `def solve(${v.str}, n):\n    res = ""\n    # Fixed\n    for i in range(n):\n        res += ${v.str}\n    return res`,
                solution: `range(n)`,
                driver: `import sys; args=sys.stdin.read().split(); print(solve(args[0], int(args[1])))`,
            }),
            javascript: (v) => ({
                initial: `function solve(${v.str}, n) {\n    let res = "";\n    // Bug: Loop condition < n-1 stops too early\n    for(let i=0; i < n-1; i++) {\n        res += ${v.str};\n    }\n    return res;\n}`,
                fullSolution: `function solve(${v.str}, n) {\n    let res = "";\n    // Fixed\n    for(let i=0; i < n; i++) {\n        res += ${v.str};\n    }\n    return res;\n}`,
                solution: `i < n`,
                driver: `const fs=require('fs'); const a=fs.readFileSync(0,'utf-8').trim().split(/\\s+/); console.log(solve(a[0], Number(a[1])));`,
            }),
            cpp: (v) => ({
                initial: `class Solution { public: string solve(string ${v.str}, int n) {\n    string res = "";\n    // Bug: < n-1 misses one iteration\n    for(int i=0; i < n-1; i++) {\n        res += ${v.str};\n    }\n    return res;\n}};`,
                fullSolution: `class Solution { public: string solve(string ${v.str}, int n) {\n    string res = "";\n    // Fixed\n    for(int i=0; i < n; i++) {\n        res += ${v.str};\n    }\n    return res;\n}};`,
                driver: `#include <iostream>\n#include <string>\nusing namespace std;\nint main(){string s; int n; cin>>s>>n; cout<<Solution().solve(s,n);}`,
            }),
            java: (v) => ({
                initial: `class Solution { public String solve(String ${v.str}, int n) {\n    String res = "";\n    // Bug: < n-1 misses one iteration\n    for(int i=0; i < n-1; i++) {\n        res += ${v.str};\n    }\n    return res;\n}}`,
                fullSolution: `class Solution { public String solve(String ${v.str}, int n) {\n    String res = "";\n    // Fixed\n    for(int i=0; i < n; i++) {\n        res += ${v.str};\n    }\n    return res;\n}}`,
                driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); if(s.hasNext()) System.out.println(new Solution().solve(s.next(), s.nextInt())); }}`,
            }),
        },
    },
};

export const generateQuestions = (count = 150) => {
    const questions = [];
    const keys = Object.keys(TEMPLATES);
    let lastKey = null;

    for (let i = 0; i < count; i++) {
        // Filter out the last used key to prevent immediate repetition
        let availableKeys = keys;
        if (lastKey && keys.length > 1) {
            availableKeys = keys.filter((k) => k !== lastKey);
        }

        const key = getRandom(availableKeys);
        lastKey = key;

        const template = TEMPLATES[key];
        const v = {
            arr: getRandom(vars.arr),
            idx: getRandom(vars.idx),
            val: getRandom(vars.val),
            target: getRandom(vars.target),
            str: getRandom(vars.str),
        };
        const problem = {
            id: i + 1,
            title: `${template.title} #${i + 1}`,
            description: template.desc,
            testCases: template.testCases,
            languages: {},
        };
        ["python", "javascript", "cpp", "java"].forEach((lang) => {
            const codeGen = template.langs[lang](v);
            let fullDriver = codeGen.driver;
            if (lang === "cpp" || lang === "java")
                fullDriver = fullDriver
                    .replace("// Insert User Code Here", "")
                    .replace("// Insert User Code Class Here", codeGen.initial);
            problem.languages[lang] = {
                initialCode: codeGen.initial,
                driverCode: fullDriver,
                solutionCode: codeGen.solution,
                fullCorrectCode: codeGen.fullSolution, // Added the full solution
            };
        });
        questions.push(problem);
    }
    return questions;
};