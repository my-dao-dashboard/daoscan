import { decodeString } from "./decode-string";

test("pass string", () => {
  const string = "foo";
  expect(decodeString(string)).toEqual(string);
});

test("decode hex", () => {
  const string = "foo";
  const hex = "0x" + Buffer.from(string).toString("hex");
  expect(decodeString(hex)).toEqual(string);
});

test("clear null symbols", () => {
  const string = "foo";
  const hex = "0x" + Buffer.from(string).toString("hex") + "\0\0";
  expect(decodeString(hex)).toEqual(string);
});
