// src/data/questionFactory.js

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const vars = {
    arr: ["nums", "data", "list", "values", "nodes"],
    idx: ["i", "j", "ptr", "curr", "k"],
    val: ["val", "x", "n", "num", "count"],
    target: ["target", "key", "goal"],
    str: ["s", "word", "text"]
};

const TEMPLATES = {
    sum_array: {
        title: "Array Summation",
        desc: "Calculate the sum of all elements.",
        testCases: [{ input: "1 2 3", expected: "6" }, { input: "-1 1", expected: "0" }],
        langs: {
            python: (v) => ({ initial: `def solve(${v.arr}):\n    total = 0\n    # Bug: range(len - 1) misses last element\n    for i in range(len(${v.arr}) - 1):\n        total += ${v.arr}[i]\n    return total`, solution: `range(len(${v.arr}))`, driver: `import sys; print(solve([int(x) for x in sys.stdin.read().split() if x]))` }),
            javascript: (v) => ({ initial: `function solve(${v.arr}) {\n    let total = 0;\n    // Bug: <= causes IndexOutOfBounds/NaN\n    for(let i=0; i<=${v.arr}.length; i++) total += ${v.arr}[i];\n    return total;\n}`, solution: `i < ${v.arr}.length`, driver: `const fs=require('fs'); console.log(solve(fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number)));` }),
            cpp: (v) => ({ initial: `class Solution { public: int solve(vector<int>& ${v.arr}) {\n    int t=0;\n    // Bug: Start at 1 misses first element\n    for(int i=1; i<${v.arr}.size(); i++) t+=${v.arr}[i];\n    return t;\n}};`, driver: `#include <iostream>\n#include <vector>\nusing namespace std;\n// Insert User Code Class Here\nint main(){vector<int> v; int i; while(cin>>i)v.push_back(i); cout<<Solution().solve(v); return 0;}` }),
            java: (v) => ({ initial: `class Solution { public int solve(int[] ${v.arr}) {\n    int t=0;\n    // Bug: <= causes Exception\n    for(int i=0; i<=${v.arr}.length; i++) t+=${v.arr}[i];\n    return t;\n}}`, driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); ArrayList<Integer> l=new ArrayList<>(); while(s.hasNextInt())l.add(s.nextInt()); System.out.println(new Solution().solve(l.stream().mapToInt(i->i).toArray())); } // Insert User Code Here\n}` })
        }
    },
    recursion_fib: {
        title: "Recursive Fibonacci",
        desc: "Calculate the Nth Fibonacci number recursively. 0->0, 1->1, 2->1, 3->2...",
        testCases: [{ input: "5", expected: "5" }, { input: "6", expected: "8" }],
        langs: {
            python: (v) => ({ initial: `def solve(n):\n    # Bug: Missing base case for n < 2\n    if n == 0: return 0\n    return solve(n-1) + solve(n-2)`, solution: `if n <= 1: return n`, driver: `import sys; print(solve(int(sys.stdin.read())))` }),
            javascript: (v) => ({ initial: `function solve(n) {\n    // Bug: Missing base case causing StackOverflow\n    if (n === 0) return 0;\n    return solve(n-1) + solve(n-2);\n}`, solution: `if (n <= 1) return n;`, driver: `const fs=require('fs'); console.log(solve(Number(fs.readFileSync(0,'utf-8'))));` }),
            cpp: (v) => ({ initial: `class Solution { public: int solve(int n) {\n    // Bug: Missing base case\n    if(n==0) return 0;\n    return solve(n-1) + solve(n-2);\n}};`, driver: `#include <iostream>\nusing namespace std;\n// Insert User Code Class Here\nint main(){int n; cin>>n; cout<<Solution().solve(n);}` }),
            java: (v) => ({ initial: `class Solution { public int solve(int n) {\n    // Bug: Missing base case\n    if(n==0) return 0;\n    return solve(n-1) + solve(n-2);\n}}`, driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s=new Scanner(System.in); System.out.println(new Solution().solve(s.nextInt())); } // Insert User Code Here\n}` })
        }
    },
    linked_list_rev: {
        title: "Reverse Linked List",
        desc: "Reverse a singly linked list. Return the new head.",
        testCases: [{ input: "1 2 3", expected: "3 2 1" }, { input: "5", expected: "5" }],
        langs: {
            python: (v) => ({ initial: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef solve(head):\n    prev = None\n    curr = head\n    while curr:\n        # Bug: Overwriting curr.next before saving it loses the list!\n        curr.next = prev\n        prev = curr\n        curr = curr.next\n    return prev`, solution: `temp = curr.next; curr.next = prev; ... curr = temp`, driver: `import sys\ndef to_list(head):\n    res = []\n    while head: res.append(str(head.val)); head = head.next\n    return " ".join(res)\ninputs = sys.stdin.read().split()\nif not inputs: exit()\nhead = ListNode(int(inputs[0]))\ncurr = head\nfor x in inputs[1:]: curr.next = ListNode(int(x)); curr = curr.next\nprint(to_list(solve(head)))` }),
            javascript: (v) => ({ initial: `class ListNode {\n    constructor(val=0, next=null) {\n        this.val = val; this.next = next;\n    }\n}\n\nfunction solve(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        // Bug: Connection lost\n        curr.next = prev;\n        prev = curr;\n        curr = curr.next;\n    }\n    return prev;\n}`, solution: `let temp = curr.next;`, driver: `const fs = require('fs'); const nums = fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number); if(nums.length === 0) return; let head = new ListNode(nums[0]); let curr = head; for(let i=1; i<nums.length; i++) { curr.next = new ListNode(nums[i]); curr = curr.next; } let res = []; let resHead = solve(head); while(resHead) { res.push(resHead.val); resHead = resHead.next; } console.log(res.join(" "));` }),
            cpp: (v) => ({ initial: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution { public: ListNode* solve(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while(curr) {\n        // Bug: Lost next pointer\n        curr->next = prev;\n        prev = curr;\n        curr = curr->next;\n    }\n    return prev;\n}};`, driver: `#include <iostream>\n#include <vector>\nusing namespace std;\n// Insert User Code Class Here\nint main() { int val; vector<int> nums; while(cin >> val) nums.push_back(val); if(nums.empty()) return 0; ListNode* head = new ListNode(nums[0]); ListNode* curr = head; for(size_t i=1; i<nums.size(); i++) { curr->next = new ListNode(nums[i]); curr = curr->next; } ListNode* res = Solution().solve(head); while(res) { cout << res->val << (res->next ? " " : ""); res = res->next; } return 0; }` }),
            java: (v) => ({ initial: `class ListNode {\n    int val; ListNode next; \n    ListNode(int x) { val = x; }\n}\n\nclass Solution {\n    public ListNode solve(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while(curr != null) {\n            // Bug: Lost connection\n            curr.next = prev;\n            prev = curr;\n            curr = curr.next;\n        }\n        return prev;\n    }\n}`, driver: `import java.util.*; public class Main { public static void main(String[] a) { Scanner s = new Scanner(System.in); if(!s.hasNextInt()) return; ListNode head = new ListNode(s.nextInt()); ListNode curr = head; while(s.hasNextInt()) { curr.next = new ListNode(s.nextInt()); curr = curr.next; } ListNode res = new Solution().solve(head); while(res != null) { System.out.print(res.val + (res.next != null ? " " : "")); res = res.next; } } // Insert User Code Here\n}` })
        }
    }
};

export const generateQuestions = (count = 150) => {
    const questions = [];
    const keys = Object.keys(TEMPLATES);
    for (let i = 0; i < count; i++) {
        const key = keys[i % keys.length];
        const template = TEMPLATES[key];
        const v = { arr: getRandom(vars.arr), idx: getRandom(vars.idx), val: getRandom(vars.val), target: getRandom(vars.target), str: getRandom(vars.str) };
        const problem = { id: i + 1, title: `${template.title} #${i + 1}`, description: template.desc, testCases: template.testCases, languages: {} };
        ["python", "javascript", "cpp", "java"].forEach(lang => {
            const codeGen = template.langs[lang](v);
            let fullDriver = codeGen.driver;
            if (lang === "cpp" || lang === "java") fullDriver = fullDriver.replace("// Insert User Code Here", "").replace("// Insert User Code Class Here", codeGen.initial);
            problem.languages[lang] = { initialCode: codeGen.initial, driverCode: fullDriver, solutionCode: codeGen.solution };
        });
        questions.push(problem);
    }
    return questions;
};