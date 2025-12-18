/**
 * In-memory data store using a simple object-based approach
 * Similar to Paper.js store pattern for persistence
 */

class PaperStore {
  constructor() {
    this.store = {
      courseTemplates: [],
    };
    this.idCounter = 1;
  }

  /**
   * Generate a new ID
   */
  generateId() {
    return `ct_${this.idCounter++}_${Date.now()}`;
  }

  /**
   * Get all course templates
   */
  getAllCourseTemplates() {
    return this.store.courseTemplates;
  }

  /**
   * Get a course template by ID
   */
  getCourseTemplateById(id) {
    return this.store.courseTemplates.find(ct => ct.id === id);
  }

  /**
   * Create a new course template
   */
  createCourseTemplate(input) {
    const courseTemplate = {
      id: this.generateId(),
      code: input.code,
      title: input.title,
      lifecycleState: input.lifecycleState || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input, // Include any other fields from input
    };
    this.store.courseTemplates.push(courseTemplate);
    return courseTemplate;
  }

  /**
   * Update a course template
   */
  updateCourseTemplate(id, input) {
    const index = this.store.courseTemplates.findIndex(ct => ct.id === id);
    if (index === -1) {
      return null;
    }
    const existing = this.store.courseTemplates[index];
    const updated = {
      ...existing,
      ...input,
      id: existing.id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };
    this.store.courseTemplates[index] = updated;
    return updated;
  }

  /**
   * Delete a course template (or mark as archived)
   */
  deleteCourseTemplate(id) {
    const index = this.store.courseTemplates.findIndex(ct => ct.id === id);
    if (index === -1) {
      return false;
    }
    this.store.courseTemplates.splice(index, 1);
    return true;
  }

  /**
   * Clear all data (useful for testing)
   */
  clear() {
    this.store = {
      courseTemplates: [],
    };
    this.idCounter = 1;
  }

  /**
   * Get store size (for debugging)
   */
  getSize() {
    return {
      courseTemplates: this.store.courseTemplates.length,
    };
  }
}

// Export singleton instance
module.exports = new PaperStore();

