import mongo, { UpdateManyOptions } from "mongodb"
import Currie, { DBridge, initLogger } from "curie-server"
import q, { natifyCondition } from "querifier"
import { UpdateQuery } from "querifier/dist/src/dictionaries/update.dict";
import { ConditionQuery, HighConditionQuery } from "querifier/dist/src/dictionaries/condition.dict";

interface HighUpdateQuery {
  [collection: string]: UpdateQuery
}

export class MongoDBridge extends DBridge<mongo.Db, HighConditionQuery> {
  cache: Map<string, {
    value: any[],
    date: Date
  }> = new Map()
  // @ts-ignore
  db: mongo.Db
  private uri: string
  constructor(db_uri: string, server?: Currie.Server) {
    super(db_uri, server)
    this.uri = db_uri
    
  }

  initConnection() {
    return new Promise(res => {
      mongo.connect(this.uri)
      .then(d => d.db())
      .then(d => {
        this.db = d
        res()
      })
      .catch(initLogger("MongoDBridge", "bgRed"))
    })
  }

  async *getIter(query: HighConditionQuery) {
    for(const collection in query) {
      const col = this.db.collection(collection)
      const dontWantMORE = yield await col.find(natifyCondition(query[collection])).toArray()
      if(dontWantMORE === true) break
    }
    return
  }

  get<T = any>(query: HighConditionQuery): Promise<T[]> {
    return new Promise(async (res, rej) => {
      const promises: any[] = []
      for(const collection in query) {
        const col = this.db.collection(collection)
        const arr = col.find(natifyCondition(query)).toArray().catch(rej)
        promises.push(arr)
      }

      res(Promise.all(promises))
    })
  }
}