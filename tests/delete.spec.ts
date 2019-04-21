import { MongoDBridge } from '../src'
import { expect } from 'chai'
import 'mocha'
import { cats_test } from './create.spec';
const URI = 'mongodb://localhost:27017/curie-mongo-test'

class DB extends MongoDBridge {}

describe('Delete', () => {
  let db = new DB(URI)

  before(async () => {
    await db.initConnection()
  })

  it("Deletes single matched", async () => {
    const res = await db.delete({
      cats_test: {
        name: {$eq: "Fluffykins"}
      }
    })

    expect(res[0].deletedCount).to.eq(1)
  })


  it("Delets many matched", async () => {
    const ress = await db.delete<cats_test>({
      cats_test: {
        age: {
          $lt: 5
        }
      }
    })
    expect(ress[0].deletedCount).to.eq(2)
  })
})
