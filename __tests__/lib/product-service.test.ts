import { describe, expect, it } from "vitest"
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/product-service"

describe("product-service", () => {
  describe("getProducts", () => {
    it("returns an array of products", () => {
      const products = getProducts()
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it("each product has required fields", () => {
      const products = getProducts()
      for (const product of products) {
        expect(product).toHaveProperty("id")
        expect(product).toHaveProperty("title")
        expect(product).toHaveProperty("price")
        expect(product).toHaveProperty("categories")
        expect(product).toHaveProperty("slug")
        expect(Array.isArray(product.categories)).toBe(true)
      }
    })

    it("all products have positive prices", () => {
      const products = getProducts()
      for (const product of products) {
        expect(product.price).toBeGreaterThan(0)
      }
    })

    it("returns products for different languages", () => {
      const plProducts = getProducts("pl")
      const enProducts = getProducts("en")
      expect(plProducts.length).toBe(enProducts.length)
    })

    it("all slugs are non-empty strings", () => {
      const products = getProducts()
      for (const product of products) {
        expect(typeof product.slug).toBe("string")
        expect(product.slug.length).toBeGreaterThan(0)
      }
    })

    it("all slugs are unique", () => {
      const products = getProducts()
      const slugs = products.map((p) => p.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })
  })

  describe("getProductBySlug", () => {
    it("returns a product for a valid slug", () => {
      const products = getProducts()
      const firstProduct = products[0]

      const found = getProductBySlug(firstProduct.slug)
      expect(found).toBeDefined()
      expect(found?.id).toBe(firstProduct.id)
    })

    it("returns undefined for invalid slug", () => {
      const found = getProductBySlug("non-existent-product-xyz-123")
      expect(found).toBeUndefined()
    })

    it("returns correct product for each slug", () => {
      const products = getProducts()
      for (const product of products.slice(0, 5)) {
        const found = getProductBySlug(product.slug)
        expect(found?.id).toBe(product.id)
      }
    })
  })

  describe("getRelatedProducts", () => {
    it("returns related products for a valid category", () => {
      const products = getProducts()
      const firstProduct = products[0]
      const category = firstProduct.categories[0]

      const related = getRelatedProducts(category, firstProduct.slug)
      expect(Array.isArray(related)).toBe(true)
    })

    it("does not include the current product in results", () => {
      const products = getProducts()
      const firstProduct = products[0]
      const category = firstProduct.categories[0]

      const related = getRelatedProducts(category, firstProduct.slug)
      const slugs = related.map((p) => p.slug)
      expect(slugs).not.toContain(firstProduct.slug)
    })

    it("respects the limit parameter", () => {
      const products = getProducts()
      const firstProduct = products[0]
      const category = firstProduct.categories[0]

      const related = getRelatedProducts(category, firstProduct.slug, 2)
      expect(related.length).toBeLessThanOrEqual(2)
    })

    it("returns empty array for non-existent category", () => {
      const related = getRelatedProducts("non-existent-category-xyz", "some-slug")
      expect(related).toEqual([])
    })
  })
})
