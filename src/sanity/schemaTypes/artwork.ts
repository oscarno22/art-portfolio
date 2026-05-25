import { defineField, defineType } from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      description: 'e.g. "Oil on canvas", "Watercolor", "Mixed media"',
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: 'e.g. "24\\" × 36\\""',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "forSale",
      title: "Available for sale",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      hidden: ({ document }) => !document?.forSale,
    }),
    defineField({
      name: "sold",
      title: "Sold",
      type: "boolean",
      initialValue: false,
      hidden: ({ document }) => !document?.forSale,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "medium",
    },
  },
});
