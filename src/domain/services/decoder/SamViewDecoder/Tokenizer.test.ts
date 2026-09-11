import {describe, expect, it} from "vitest";
import { Tokenizer } from "./Tokenizer";

describe("Tokenizer", () => {

    it("tokenizes a simple samtools command", () => {
        expect(Tokenizer.tokenize("samtools view -f 3 -q 10 input.bam")).toEqual([
            "samtools",
            "view",
            "-f",
            "3",
            "-q",
            "10",
            "input.bam",
        ]);
    });

    it("tokenizes a command with quoted arguments", () => {
        expect(Tokenizer.tokenize('samtools view -o "output file.bam" -O BAM')).toEqual([
            "samtools",
            "view",
            "-o",
            "output file.bam",
            "-O",
            "BAM"
        ]);
    });

    it("tokenizes a command with single-quoted arguments", () => {
        expect(Tokenizer.tokenize("samtools view -o 'output file.bam' -O BAM")).toEqual([
            "samtools",
            "view",
            "-o",
            "output file.bam",
            "-O",
            "BAM"
        ]);
    });

    it("tokenizes a command with mixed quotes and spaces", () => {
        expect(Tokenizer.tokenize('samtools view -o "output file.bam" -O BAM -f 3')).toEqual([
            "samtools",
            "view",
            "-o",
            "output file.bam",
            "-O",
            "BAM",
            "-f",
            "3"
        ]);
    });

    it("tokenizes a command with multiple spaces", () => {
        expect(Tokenizer.tokenize("samtools   view   -f 3   -q 10   input.bam")).toEqual([
            "samtools",
            "view",
            "-f",
            "3",
            "-q",
            "10",
            "input.bam",
        ]);
    });

    it("tokenizes a command with no arguments", () => {
        expect(Tokenizer.tokenize("samtools view")).toEqual([
            "samtools",
            "view"
        ]);
    });

    it("tokenizes an empty command", () => {
        expect(Tokenizer.tokenize("")).toEqual([]);
    });
});