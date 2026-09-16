import { describe, expect, test } from "vitest";

import { formatCount, formatDuration, formatStorage } from "./_funcs";

/*
   The three figures the stats screen shows.

   These were `numbro` - a hundred kilobytes of the stats bundle, shipped to
   produce a thousands separator, a clock and a byte unit. Every expectation
   below was taken from what numbro actually returned for that input before it
   was removed, because this is a dependency leaving rather than a redesign of
   how a figure reads.
*/
describe("counts", () => {
    test("separate thousands and leave smaller numbers alone", () => {
        expect(formatCount(0)).toBe("0");
        expect(formatCount(999)).toBe("999");
        expect(formatCount(1000)).toBe("1,000");
        expect(formatCount(1234567)).toBe("1,234,567");
    });
});

describe("durations", () => {
    test("read as hours, minutes and seconds", () => {
        expect(formatDuration(0)).toBe("0:00:00");
        expect(formatDuration(5)).toBe("0:00:05");
        expect(formatDuration(65)).toBe("0:01:05");
        expect(formatDuration(3725)).toBe("1:02:05");
    });

    /*
       Hours are not padded and are not wrapped. A library of photographs adds
       up to days of video, and a clock face reading `01:00:00` for twenty-five
       hours would be wrong rather than merely terse.
    */
    test("and keep counting past a day", () => {
        expect(formatDuration(86400)).toBe("24:00:00");
        expect(formatDuration(90061)).toBe("25:01:01");
    });
});

describe("storage", () => {
    // decimal, as storage is sold and as the API reports it
    test("steps up a unit every thousand, not every 1024", () => {
        expect(formatStorage(999)).toBe("999.00 B");
        expect(formatStorage(1000)).toBe("1.00 KB");
        expect(formatStorage(1500)).toBe("1.50 KB");
        expect(formatStorage(1234567)).toBe("1.23 MB");
    });

    test("and keeps stepping for a library that has grown", () => {
        expect(formatStorage(5000000000)).toBe("5.00 GB");
        expect(formatStorage(1234567890123)).toBe("1.23 TB");
    });

    test("nothing at all is nothing, in bytes", () => {
        expect(formatStorage(0)).toBe("0.00 B");
    });
});
