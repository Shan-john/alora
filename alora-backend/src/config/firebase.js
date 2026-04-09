// Firebase is removed! This file is a mock to prevent admin routes from crashing
// until they are fully migrated to PostgreSQL.
module.exports = {
  db: {
    collection: () => ({
      get: async () => ({ docs: [] }),
      doc: () => ({
        get: async () => ({ exists: false, data: () => ({}) }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      }),
      where: () => ({
        get: async () => ({ docs: [] })
      })
    })
  },
  admin: {}
};
