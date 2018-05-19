import server from './socket'
import setupDb from './db'

const port = process.env.PORT || 4001

setupDb()
  .then(_ => {
    server.listen(port, () => console.log(`Listening on port ${port}`))
  })
  .catch(err => console.error(err))
