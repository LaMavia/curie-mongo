import { MongoDBridge } from '../src'
import { expect } from 'chai'
import 'mocha'
const URI = 'mongodb://localhost:27017/curie-mongo-test'

class DB extends MongoDBridge {}

describe('get', () => {
  let db = new DB(URI)
  const allCatsQuery = { cats: { $exec: () => true } }

  before(async () => {
    await db.initConnection()
  })

  it('Single collection', async () => {
    const res = await db.get(allCatsQuery)
    expect(res[0].length).eq(3)
  })

  it('Iterator', async () => {
    const iter = db.getIter(allCatsQuery)
    for await (const col of iter) {
      expect(col.length).to.eq(3)
    }
  })
})
