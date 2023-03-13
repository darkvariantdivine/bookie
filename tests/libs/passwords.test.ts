
import {checkStrength} from "@/libs/passwords";
import {
  test,
  expect,
} from "@jest/globals";

test('Empty string', () => {
  expect(checkStrength('')).toBe(0);
});

test('Single lowercase letters', () => {
  expect(checkStrength('a')).toBe(20);
});

test('Multiple lowercase letters', () => {
  expect(checkStrength('abcdef')).toBe(20);
});

test('Single uppercase and multiple lowercase letters', () => {
  expect(checkStrength('Abcde')).toBe(40);
});

test('Single uppercase, number and multiple lowercase letters', () => {
  expect(checkStrength('Abcde1')).toBe(60);
});

test('Single uppercase, number, special character and multiple lowercase letters', () => {
  expect(checkStrength('Abcde1!')).toBe(80);
});

test('Single uppercase, number, special character, multiple lowercase letters and at least 8 characters',
  () => {
  expect(checkStrength('Abcdef1!')).toBe(100);
});