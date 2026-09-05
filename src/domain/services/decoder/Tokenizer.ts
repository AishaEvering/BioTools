export class Tokenizer {
    static  tokenizeSamCommand(input: string): string[] {
        const tokens: string[] = [];

        /*
            "([^"]*)"     something inside double quotes
                OR
            '([^']*)'     something inside single quotes
                OR
            (\S+)         consecutive non-whitespace characters
        */
        const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;

        let match: RegExpExecArray | null;

        while ((match = pattern.exec(input)) !== null) {
            tokens.push(match[1] || match[2] || match[3]);
        }

        return tokens;     
    } 
}