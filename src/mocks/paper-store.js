/**
 * Paper-like store wrapper for in-memory data storage
 * Provides a Paper-compatible API using Maps internally
 */

export class PaperStore {
  constructor() {
    this.stores = new Map(); // typeName -> Map<id, entity>
  }

  /**
   * Add an entity to the store
   */
  add(typeName, entity) {
    if (!this.stores.has(typeName)) {
      this.stores.set(typeName, new Map());
    }
    const typeStore = this.stores.get(typeName);
    typeStore.set(entity.id, entity);
    return entity;
  }

  /**
   * Get an entity from the store
   */
  get(typeName, id) {
    const typeStore = this.stores.get(typeName);
    if (!typeStore) {
      return null;
    }
    return typeStore.get(id) || null;
  }

  /**
   * Update an entity in the store
   */
  update(typeName, id, updates) {
    const typeStore = this.stores.get(typeName);
    if (!typeStore) {
      return null;
    }
    const entity = typeStore.get(id);
    if (!entity) {
      return null;
    }
    const updated = { ...entity, ...updates };
    typeStore.set(id, updated);
    return updated;
  }

  /**
   * Remove an entity from the store
   */
  remove(typeName, id) {
    const typeStore = this.stores.get(typeName);
    if (!typeStore) {
      return null;
    }
    const entity = typeStore.get(id);
    if (entity) {
      typeStore.delete(id);
      return entity;
    }
    return null;
  }

  /**
   * List all entities of a type
   */
  list(typeName) {
    const typeStore = this.stores.get(typeName);
    if (!typeStore) {
      return [];
    }
    return Array.from(typeStore.values());
  }

  /**
   * Clear all entities
   */
  clear() {
    this.stores.clear();
  }

  /**
   * Clear all entities of a specific type
   */
  clearType(typeName) {
    this.stores.delete(typeName);
  }
}

