import { describe, it, expect } from "vitest";
import {
  safeBooleanCoerce,
  commaDelimitedArray,
  jsonStringCoerce,
  strictCoerceStringDate,
} from "../src";

describe("utilities", () => {
  describe("safeBooleanCoerce", () => {
    it("should parse boolean true", () => {
      expect(safeBooleanCoerce.parse(true)).toBe(true);
    });

    it("should parse boolean false", () => {
      expect(safeBooleanCoerce.parse(false)).toBe(false);
    });

    it('should parse string "true" to true', () => {
      expect(safeBooleanCoerce.parse("true")).toBe(true);
    });

    it('should parse string "false" to false', () => {
      expect(safeBooleanCoerce.parse("false")).toBe(false);
    });

    it("should throw error for invalid string", () => {
      expect(() => safeBooleanCoerce.parse("invalid")).toThrow(
        "Invalid boolean value",
      );
    });

    it('should throw error for string "1"', () => {
      expect(() => safeBooleanCoerce.parse("1")).toThrow(
        "Invalid boolean value",
      );
    });

    it('should throw error for string "0"', () => {
      expect(() => safeBooleanCoerce.parse("0")).toThrow(
        "Invalid boolean value",
      );
    });

    it("should throw error for number", () => {
      expect(() => safeBooleanCoerce.parse(1)).toThrow();
    });
  });

  describe("commaDelimitedArray", () => {
    it("should parse comma-delimited string to array", () => {
      expect(commaDelimitedArray.parse("value1,value2,value3")).toEqual([
        "value1",
        "value2",
        "value3",
      ]);
    });

    it("should trim whitespace from values", () => {
      expect(commaDelimitedArray.parse("value1, value2 , value3")).toEqual([
        "value1",
        "value2",
        "value3",
      ]);
    });

    it("should return empty array for empty string", () => {
      expect(commaDelimitedArray.parse("")).toEqual([]);
    });

    it("should filter out empty values from leading comma", () => {
      expect(commaDelimitedArray.parse(",value")).toEqual(["value"]);
    });

    it("should filter out empty values from trailing comma", () => {
      expect(commaDelimitedArray.parse("value,")).toEqual(["value"]);
    });

    it("should filter out empty values from multiple consecutive commas", () => {
      expect(commaDelimitedArray.parse("value1,,value2")).toEqual([
        "value1",
        "value2",
      ]);
    });

    it("should filter out empty values from spaces and commas", () => {
      expect(commaDelimitedArray.parse(" , , ")).toEqual([]);
    });

    it("should handle single value", () => {
      expect(commaDelimitedArray.parse("value")).toEqual(["value"]);
    });

    it("should throw error for non-string input", () => {
      expect(() => commaDelimitedArray.parse(123)).toThrow(
        "Invalid comma delimited array - must be a string",
      );
    });

    it("should throw error for array input", () => {
      expect(() => commaDelimitedArray.parse(["value1", "value2"])).toThrow(
        "Invalid comma delimited array - must be a string",
      );
    });

    it("should throw error for object input", () => {
      expect(() => commaDelimitedArray.parse({})).toThrow(
        "Invalid comma delimited array - must be a string",
      );
    });

    it("should handle whitespace-only string", () => {
      expect(commaDelimitedArray.parse("   ")).toEqual([]);
    });

    it("should handle single comma", () => {
      expect(commaDelimitedArray.parse(",")).toEqual([]);
    });
  });

  describe("jsonStringCoerce", () => {
    it("should parse valid JSON object", () => {
      const result = jsonStringCoerce.parse('{"key":"value"}');
      expect(result).toEqual({ key: "value" });
    });

    it("should parse valid JSON array", () => {
      const result = jsonStringCoerce.parse("[1,2,3]");
      expect(result).toEqual([1, 2, 3]);
    });

    it("should parse valid JSON string", () => {
      const result = jsonStringCoerce.parse('"hello"');
      expect(result).toBe("hello");
    });

    it("should parse valid JSON number", () => {
      const result = jsonStringCoerce.parse("123");
      expect(result).toBe(123);
    });

    it("should parse valid JSON boolean", () => {
      const result = jsonStringCoerce.parse("true");
      expect(result).toBe(true);
    });

    it("should parse valid JSON null", () => {
      const result = jsonStringCoerce.parse("null");
      expect(result).toBe(null);
    });

    it("should parse nested JSON objects", () => {
      const result = jsonStringCoerce.parse('{"a":{"b":{"c":1}}}');
      expect(result).toEqual({ a: { b: { c: 1 } } });
    });

    it("should throw error for invalid JSON", () => {
      expect(() => jsonStringCoerce.parse("invalid")).toThrow(
        "Invalid JSON string - cannot be parsed",
      );
    });

    it("should throw error for malformed JSON", () => {
      expect(() => jsonStringCoerce.parse("{key:value}")).toThrow(
        "Invalid JSON string - cannot be parsed",
      );
    });

    it("should throw error for incomplete JSON", () => {
      expect(() => jsonStringCoerce.parse('{"key"')).toThrow(
        "Invalid JSON string - cannot be parsed",
      );
    });

    it("should throw error for non-string input", () => {
      expect(() => jsonStringCoerce.parse(123)).toThrow();
    });
  });
});

describe("strictCoerceStringDate", () => {
  it("should parse valid ISO date string", () => {
    const result = strictCoerceStringDate.parse("2025-11-06T12:00:00Z");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2025-11-06T12:00:00.000Z");
  });

  it("should parse date string without time", () => {
    const result = strictCoerceStringDate.parse("2025-11-06");
    expect(result).toBeInstanceOf(Date);
  });

  it("should throw error for timestamp string", () => {
    // Pure numeric timestamp strings don't parse as valid dates
    expect(() => strictCoerceStringDate.parse("1699272000000")).toThrow();
  });

  it("should parse human-readable date string", () => {
    const result = strictCoerceStringDate.parse("Nov 6, 2025");
    expect(result).toBeInstanceOf(Date);
  });

  it("should throw error for null", () => {
    expect(() => strictCoerceStringDate.parse(null)).toThrow();
  });

  it("should throw error for undefined", () => {
    expect(() => strictCoerceStringDate.parse(undefined)).toThrow();
  });

  it("should throw error for empty string", () => {
    expect(() => strictCoerceStringDate.parse("")).toThrow();
  });

  it("should throw error for invalid date string", () => {
    expect(() => strictCoerceStringDate.parse("not a date")).toThrow();
  });

  it("should throw error for number input", () => {
    expect(() => strictCoerceStringDate.parse(1699272000000)).toThrow();
  });

  it("should throw error for Date object input", () => {
    expect(() => strictCoerceStringDate.parse(new Date())).toThrow();
  });
});
