import { describe, it, expect } from 'vitest'
import { testEsmAndCjs } from './test-utils.js'

await testEsmAndCjs(async (importType) => {
  const { PGlite } =
    importType === 'esm'
      ? await import('../dist/index.js')
      : await import('../dist/index.cjs')

  const { postgis } =
    importType === 'esm'
      ? await import('../dist/postgis/index.js')
      : await import('../dist/postgis/index.cjs')

  describe(`postgis ${importType}`, () => {
    it('basic', async () => {
      const pg = new PGlite({
        extensions: {
          postgis,
        },
      })

      await pg.exec('CREATE EXTENSION IF NOT EXISTS postgis;')
      /*
      await pg.exec(`
    CREATE TABLE IF NOT EXISTS test (
      id SERIAL PRIMARY KEY,
      name TEXT,
      vec vector(3)
    );
  `)
      await pg.exec("INSERT INTO test (name, vec) VALUES ('test1', '[1,2,3]');")
      await pg.exec("INSERT INTO test (name, vec) VALUES ('test2', '[4,5,6]');")
      await pg.exec("INSERT INTO test (name, vec) VALUES ('test3', '[7,8,9]');")
*/
      const res = await pg.exec(`
        SELECT postgis_full_version();
  `)

      expect(res).toMatchObject([
        {
          rows: [
            {
              name: 'test1',
              vec: '[1,2,3]',
              distance: 2.449489742783178,
            },
          ],
          fields: [
            {
              name: 'name',
              dataTypeID: 25,
            },
          ],
          affectedRows: 0,
        },
      ])
    })
  })
})