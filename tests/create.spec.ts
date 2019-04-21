import { MongoDBridge } from '../src'
import { expect } from 'chai'
import 'mocha'
const URI = 'mongodb://localhost:27017/curie-mongo-test'
class DB extends MongoDBridge {}

export class cats_test {
  name: string
  breed: string
  age: number
  constructor({ name, breed, age }: cats_test) {
    let [f, ...rest] = name.split('')
    this.name = [f.toUpperCase(), ...rest].join('')
    this.breed = breed.toLocaleLowerCase()
    this.age = age
  }

  meow() {
    console.log("Meow... I won't exist in the db... meow")
  }
}

describe('Create', () => {
  let db = new DB(URI)
  

  before(async () => {
    await db.initConnection()
  })

  it('Single insert', async () => {
    const res = await db.create(cats_test, {
      name: 'Jon',
      age: 1,
      breed: 'munchkin'
    })

    expect(res.result.ok).to.eq(1)
    expect(res.result.n).to.eq(1)
  })

  it('Multiple inserts', async () => {
    const res = await db.create(cats_test, [
      {
        name: 'Ben',
        age: 2,
        breed: 'Persian'
      },
      {
        name: 'Fluffykins',
        age: 4,
        breed: 'Munchkin'
      }
    ])

    expect(res.insertedCount).to.eq(2)
    expect(res.result.ok).to.eq(1)
  })
})
