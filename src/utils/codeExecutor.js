const PISTON_API = "https://emkc.org/api/v2/piston/execute";

export const executeCode = async (language, sourceCode, input = "") => {
    const runtimes = {
        javascript: { language: "javascript", version: "18.15.0" },
        python: { language: "python", version: "3.10.0" },
        cpp: { language: "c++", version: "10.2.0" },
        java: { language: "java", version: "15.0.2" },
    };

    const config = runtimes[language.toLowerCase()] || runtimes.javascript;
    const fileName = language === 'java' ? 'Main.java' : undefined;

    try {
        // Add a timeout to prevent hanging if API is slow (8 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(PISTON_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: config.language,
                version: config.version,
                files: [{ name: fileName, content: sourceCode }],
                stdin: input,
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!data.run) {
            return { output: "", error: "Connection Error: Compiler Unreachable", isError: true };
        }

        return {
            output: data.run.stdout.trim(),
            error: data.run.stderr,
            isError: !!data.run.stderr || data.run.code !== 0,
        };
    } catch (error) {
        return {
            output: "",
            error: error.name === 'AbortError' ? "Execution Timed Out" : "Execution Error: " + error.message,
            isError: true,
        };
    }
};