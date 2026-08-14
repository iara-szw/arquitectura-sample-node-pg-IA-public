

import test from 'node:test';
import assert from 'node:assert/strict';

test('GET /api/alumnos devuelve status 200 y un array', async () => {
    const response = await fetch('http://localhost:3000/api/alumnos');

    const texto = await response.text();
    assert.equal(response.status, 200);
});