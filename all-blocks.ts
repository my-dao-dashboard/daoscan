import axios from 'axios'
import axiosRetry from 'axios-retry';
import * as _ from 'lodash'

axiosRetry(axios, { retries: 3, retryCondition: () => true });
import * as fs from 'fs'

const aa = JSON.parse(fs.readFileSync('./a.json').toString())

const blocks = aa.items.Items.map((e: any) => e.blockNumber)

async function main() {
  for (let i = 0; i < blocks.length; i = i + 10) {
    const promises = _.times(10).map(async j => {
      return axios.post('https://d2revro29l.execute-api.us-east-1.amazonaws.com/dev/block', {
        id: blocks[i + j]
      })
    })
    await Promise.all(promises)
    console.log(`Done ${i} out of ${blocks.length}`)
  }
}

main()
