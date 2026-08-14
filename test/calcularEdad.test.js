import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularEdad } from '../src/helpers/fechas-helper.js';

// Fecha válida: resultado fijo, no depende del día actual
test('calcularEdad - fecha de nacimiento valida', () => {
    const hoy = new Date(2026, 7, 14);

    assert.equal(calcularEdad('2000-01-01', hoy), 26);
});
// Cumpleaños todavía no pasó
test('calcularEdad - cumpleaños todavía no pasó', () => {
    const hoy = new Date(2026, 7, 14); // 14/08/2026
    assert.equal(calcularEdad('2005-12-31', hoy), 20);
});

// null
test('calcularEdad - null devuelve null', () => {
    assert.equal(calcularEdad(null), null);
});

// undefined
test('calcularEdad - undefined devuelve null', () => {
    assert.equal(calcularEdad(undefined), null);
});

// String vacío
test('calcularEdad - string vacío devuelve null', () => {
    assert.equal(calcularEdad(''), null);
});

// Fecha inválida
test('calcularEdad - fecha inválida devuelve NaN', () => {
    assert.ok(Number.isNaN(calcularEdad('fecha')));
});

// Fecha con mes inválido
test('calcularEdad - mes inválido devuelve NaN', () => {
    assert.ok(Number.isNaN(calcularEdad('2005-13-10')));
});

// Fecha con día inválido
test('calcularEdad - día inválido devuelve NaN', () => {
    assert.ok(Number.isNaN(calcularEdad('2005-02-30')));
});
// Fecha futura
test('calcularEdad - fecha futura devuelve edad negativa', () => {
    assert.ok(calcularEdad('2030-01-01') < 0);
});

// Año bisiesto
test('calcularEdad - fecha de año bisiesto', () => {
    assert.equal(typeof calcularEdad('2004-02-29'), 'number');
});