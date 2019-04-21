import * as d from "../data"
import { MongoDBridge } from "../src";
import { expect } from "chai"
import 'mocha';

class DB extends MongoDBridge {}

describe("GET", () => {
  let db = new DB(d.URI)
  const allCatsQuery = {cats: {$exec: () => true}}

  before(async () => {
    await db.initConnection()
  })

  it("Single collection", async () => {
    const res = await db.get(allCatsQuery)
    console.log(res)
    expect(res[0].length).eq(3)
  })

  it("Iterator", async () => {
    const iter = db.getIter(allCatsQuery)
    for await (const col of iter) {
      console.log(col)
      expect(col.length).to.eq(3)
    }
  })
})
