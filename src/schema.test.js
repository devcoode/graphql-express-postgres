import { resolvers } from './schema'
import { db } from './db'

beforeAll(async () => {
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

beforeEach(async () => {
  await db.seed.run()
})

test('root resolver returns context user', () => {
  const user = { email: 'user@test.com' }
  expect(resolvers.Query.viewer(null, null, { context: { user } })).toBe(user)
})

test('post.user returns single user', async () => {
  expect(await resolvers.Post.user({ author_id: 1 })).toHaveProperty('email', 'user@test.com')
})

test('post.comments returns comments for post', async () => {
  const expected = [{ author_id: 1, body: 'comment body', id: 1, postDate: null, post_id: 1 }]
  expect(await resolvers.Post.comments({ id: 1 })).toEqual(expected)
})

test('user.posts returns posts', async () => {
  const expected = [{ author_id: 1, body: 'post body', id: 1, postDate: null, title: 'post title' }]
  expect(await resolvers.User.posts({ id: 1 }, {})).toEqual(expected)
})
