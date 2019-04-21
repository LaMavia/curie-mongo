import { MongoDBridge } from '../src'
import { expect } from 'chai'
import 'mocha'
const URI = 'mongodb://localhost:27017/curie-mongo-test'

class DB extends MongoDBridge {}

describe('Update', () => {
  let db = new DB(URI)

  before(async () => {
    await db.initConnection()
  })

  it("Works with single matched", async () => {
    const res = await db.update({
      filter: {
        name: "Simba"
      },
      collection: "cats",
      query: {
        $set: {name: "James"}
      }
    })

    expect(res.matchedCount).to.eq(1)
    expect(res.modifiedCount).to.eq(1)
  })

  after(async () => {
    await db.db.collection('cats').updateMany({
      name: "James"
    }, {
      $set: { name: "Simba" }
    })
  })
})
